import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { getServerConfig } from "../config.server";

// ============================================================================
// BONUS CALCULATION SERVICE
// ============================================================================

// Calculate commission for a single sale
export const calculateCommission = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    order_id: z.string().uuid(),
    seller_id: z.string().uuid(),
    order_amount: z.number().min(0),
  }))
  .handler(async ({ data }) => {
    const config = getServerConfig();
    const supabaseUrl = config.supabaseUrl;
    const supabaseAnonKey = config.supabaseAnonKey;

    // Get seller's plan
    const sellerResponse = await fetch(
      `${supabaseUrl}/rest/customers?id=eq.${data.seller_id}&select=plan_id,plans(*)`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    if (!sellerResponse.ok) {
      throw new Error("Failed to fetch seller plan");
    }

    const sellerData = await sellerResponse.json();
    const seller = sellerData[0];

    if (!seller || !seller.plan_id) {
      return {
        direct_commission: 0,
        mlm_commissions: [],
        total_commission: 0,
        breakdown: [],
      };
    }

    const plan = seller.plans;
    const direct_commission = data.order_amount * (plan.direct_bonus_percentage / 100);

    // Get MLM commissions (upline bonuses)
    const networkResponse = await fetch(
      `${supabaseUrl}/rest/network_relationships?customer_id=eq.${data.seller_id}&select=sponsor_customer_id,level`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    if (!networkResponse.ok) {
      throw new Error("Failed to fetch network relationships");
    }

    const networkData = await networkResponse.json();
    const sponsor = networkData[0];

    const mlm_commissions = [];
    let total_mlm_commission = 0;

    if (sponsor && sponsor.sponsor_customer_id) {
      // Get sponsor's plan bonuses
      const bonusesResponse = await fetch(
        `${supabaseUrl}/rest/plan_bonuses?plan_id=eq.${plan.id}&select=*`,
        {
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (bonusesResponse.ok) {
        const bonuses = await bonusesResponse.json();

        for (const bonus of bonuses) {
          if (bonus.bonus_type === "generation" && bonus.generation === 1) {
            const commission = data.order_amount * (bonus.bonus_percentage / 100);
            mlm_commissions.push({
              recipient_id: sponsor.sponsor_customer_id,
              generation: bonus.generation,
              percentage: bonus.bonus_percentage,
              amount: commission,
              bonus_type: bonus.bonus_type,
            });
            total_mlm_commission += commission;
          }
        }
      }
    }

    return {
      direct_commission,
      mlm_commissions,
      total_commission: direct_commission + total_mlm_commission,
      breakdown: [
        {
          type: "direct",
          recipient_id: data.seller_id,
          percentage: plan.direct_bonus_percentage,
          amount: direct_commission,
        },
        ...mlm_commissions,
      ],
    };
  });

// Calculate full MLM commission distribution for a sale
export const calculateMLMCommission = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    order_id: z.string().uuid(),
    seller_id: z.string().uuid(),
    order_amount: z.number().min(0),
  }))
  .handler(async ({ data }) => {
    const config = getServerConfig();
    const supabaseUrl = config.supabaseUrl;
    const supabaseAnonKey = config.supabaseAnonKey;

    // Get seller's plan
    const sellerResponse = await fetch(
      `${supabaseUrl}/rest/customers?id=eq.${data.seller_id}&select=plan_id,plans(*)`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    if (!sellerResponse.ok) {
      throw new Error("Failed to fetch seller plan");
    }

    const sellerData = await sellerResponse.json();
    const seller = sellerData[0];

    if (!seller || !seller.plan_id) {
      return {
        distribution: [],
        total_commission: 0,
      };
    }

    const plan = seller.plans;
    const direct_commission = data.order_amount * (plan.direct_bonus_percentage / 100);

    // Get upline chain for MLM commissions
    const distribution = [];
    let current_customer_id = data.seller_id;
    let generation = 1;
    let total_commission = direct_commission;

    // Add direct commission
    distribution.push({
      recipient_id: data.seller_id,
      recipient_name: seller.nome_completo,
      generation: 0,
      type: "direct",
      percentage: plan.direct_bonus_percentage,
      amount: direct_commission,
    });

    // Get plan bonuses for MLM generations
    const bonusesResponse = await fetch(
      `${supabaseUrl}/rest/plan_bonuses?plan_id=eq.${plan.id}&select=*`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    let bonuses = [];
    if (bonusesResponse.ok) {
      bonuses = await bonusesResponse.json();
    }

    // Walk up the upline chain
    while (current_customer_id && generation <= plan.max_generations) {
      // Get sponsor
      const sponsorResponse = await fetch(
        `${supabaseUrl}/rest/network_relationships?customer_id=eq.${current_customer_id}&select=sponsor_customer_id,level`,
        {
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (!sponsorResponse.ok) break;

      const sponsorData = await sponsorResponse.json();
      const sponsor = sponsorData[0];

      if (!sponsor || !sponsor.sponsor_customer_id) break;

      // Get sponsor's plan
      const sponsorPlanResponse = await fetch(
        `${supabaseUrl}/rest/customers?id=eq.${sponsor.sponsor_customer_id}&select=nome_completo,plan_id,plans(*)`,
        {
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (!sponsorPlanResponse.ok) break;

      const sponsorPlanData = await sponsorPlanResponse.json();
      const sponsorCustomer = sponsorPlanData[0];

      if (!sponsorCustomer || !sponsorCustomer.plan_id) break;

      // Check if this generation has a bonus
      const generationBonus = bonuses.find(
        (b) => b.bonus_type === "generation" && b.generation === generation
      );

      if (generationBonus) {
        const commission = data.order_amount * (generationBonus.bonus_percentage / 100);
        distribution.push({
          recipient_id: sponsor.sponsor_customer_id,
          recipient_name: sponsorCustomer.nome_completo,
          generation: generation,
          type: "generation",
          percentage: generationBonus.bonus_percentage,
          amount: commission,
        });
        total_commission += commission;
      }

      current_customer_id = sponsor.sponsor_customer_id;
      generation++;
    }

    // Check for direct bonuses (if sponsor has enough direct recruits)
    if (bonuses.some((b) => b.bonus_type === "direct_bonus")) {
      const sponsorResponse = await fetch(
        `${supabaseUrl}/rest/network_relationships?customer_id=eq.${data.seller_id}&select=sponsor_customer_id`,
        {
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (sponsorResponse.ok) {
        const sponsorData = await sponsorResponse.json();
        const sponsor = sponsorData[0];

        if (sponsor && sponsor.sponsor_customer_id) {
          // Count sponsor's direct recruits
          const directCountResponse = await fetch(
            `${supabaseUrl}/rest/network_relationships?sponsor_customer_id=eq.${sponsor.sponsor_customer_id}&select=customer_id`,
            {
              headers: {
                "apikey": supabaseAnonKey,
                "Authorization": `Bearer ${supabaseAnonKey}`,
              },
            }
          );

          if (directCountResponse.ok) {
            const directRecruits = await directCountResponse.json();
            const directCount = directRecruits.length;

            // Check for direct bonuses
            for (const bonus of bonuses) {
              if (
                bonus.bonus_type === "direct_bonus" &&
                directCount >= bonus.required_directs
              ) {
                const commission = data.order_amount * (bonus.bonus_percentage / 100);
                distribution.push({
                  recipient_id: sponsor.sponsor_customer_id,
                  recipient_name: "Sponsor",
                  generation: 0,
                  type: "direct_bonus",
                  percentage: bonus.bonus_percentage,
                  amount: commission,
                  required_directs: bonus.required_directs,
                  actual_directs: directCount,
                });
                total_commission += commission;
              }
            }
          }
        }
      }
    }

    return {
      distribution,
      total_commission,
    };
  });

// Simulate commission for a hypothetical sale
export const simulateCommission = createServerFn({ method: "POST" })
  .inputValidator(z.object({
    seller_id: z.string().uuid(),
    order_amount: z.number().min(0),
  }))
  .handler(async ({ data }) => {
    const config = getServerConfig();
    const supabaseUrl = config.supabaseUrl;
    const supabaseAnonKey = config.supabaseAnonKey;

    // Get seller's plan
    const sellerResponse = await fetch(
      `${supabaseUrl}/rest/customers?id=eq.${data.seller_id}&select=*,plans(*)`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    if (!sellerResponse.ok) {
      throw new Error("Failed to fetch seller plan");
    }

    const sellerData = await sellerResponse.json();
    const seller = sellerData[0];

    if (!seller || !seller.plan_id) {
      return {
        error: "Seller has no active plan",
        simulation: null,
      };
    }

    const plan = seller.plans;

    // Get plan bonuses
    const bonusesResponse = await fetch(
      `${supabaseUrl}/rest/plan_bonuses?plan_id=eq.${plan.id}&select=*`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    let bonuses = [];
    if (bonusesResponse.ok) {
      bonuses = await bonusesResponse.json();
    }

    // Calculate direct commission
    const direct_commission = data.order_amount * (plan.direct_bonus_percentage / 100);

    // Calculate MLM commissions
    const mlm_commissions = [];
    let current_customer_id = data.seller_id;
    let generation = 1;
    let total_mlm = 0;

    while (current_customer_id && generation <= plan.max_generations) {
      const sponsorResponse = await fetch(
        `${supabaseUrl}/rest/network_relationships?customer_id=eq.${current_customer_id}&select=sponsor_customer_id`,
        {
          headers: {
            "apikey": supabaseAnonKey,
            "Authorization": `Bearer ${supabaseAnonKey}`,
          },
        }
      );

      if (!sponsorResponse.ok) break;

      const sponsorData = await sponsorResponse.json();
      const sponsor = sponsorData[0];

      if (!sponsor || !sponsor.sponsor_customer_id) break;

      const generationBonus = bonuses.find(
        (b) => b.bonus_type === "generation" && b.generation === generation
      );

      if (generationBonus) {
        const commission = data.order_amount * (generationBonus.bonus_percentage / 100);
        mlm_commissions.push({
          generation: generation,
          percentage: generationBonus.bonus_percentage,
          amount: commission,
        });
        total_mlm += commission;
      }

      current_customer_id = sponsor.sponsor_customer_id;
      generation++;
    }

    // Calculate direct bonuses
    const direct_bonuses = [];
    const sponsorResponse = await fetch(
      `${supabaseUrl}/rest/network_relationships?customer_id=eq.${data.seller_id}&select=sponsor_customer_id`,
      {
        headers: {
          "apikey": supabaseAnonKey,
          "Authorization": `Bearer ${supabaseAnonKey}`,
        },
      }
    );

    let total_direct_bonus = 0;
    if (sponsorResponse.ok) {
      const sponsorData = await sponsorResponse.json();
      const sponsor = sponsorData[0];

      if (sponsor && sponsor.sponsor_customer_id) {
        const directCountResponse = await fetch(
          `${supabaseUrl}/rest/network_relationships?sponsor_customer_id=eq.${sponsor.sponsor_customer_id}&select=customer_id`,
          {
            headers: {
              "apikey": supabaseAnonKey,
              "Authorization": `Bearer ${supabaseAnonKey}`,
            },
          }
        );

        if (directCountResponse.ok) {
          const directRecruits = await directCountResponse.json();
          const directCount = directRecruits.length;

          for (const bonus of bonuses) {
            if (
              bonus.bonus_type === "direct_bonus" &&
              directCount >= bonus.required_directs
            ) {
              const commission = data.order_amount * (bonus.bonus_percentage / 100);
              direct_bonuses.push({
                required_directs: bonus.required_directs,
                actual_directs: directCount,
                percentage: bonus.bonus_percentage,
                amount: commission,
              });
              total_direct_bonus += commission;
            }
          }
        }
      }
    }

    return {
      simulation: {
        plan: {
          name: plan.name,
          slug: plan.slug,
          price: plan.price,
        },
        order_amount: data.order_amount,
        direct_commission,
        mlm_commissions,
        direct_bonuses,
        total_commission: direct_commission + total_mlm + total_direct_bonus,
        breakdown: {
          direct: direct_commission,
          mlm: total_mlm,
          direct_bonus: total_direct_bonus,
        },
      },
    };
  });
