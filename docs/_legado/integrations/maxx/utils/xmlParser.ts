// Utilitário para parsing de XML da Maxx API

import { MaxxXmlRequest, MaxxXmlResponse, MaxxApiRequest, MaxxApiResponse } from '../types';

/**
 * Converte um objeto de requisição para XML no formato esperado pela Maxx API
 */
export function parseRequestToXml(request: MaxxApiRequest): string {
  const xmlRequest: MaxxXmlRequest = {
    api: {
      request
    }
  };

  return objectToXml(xmlRequest);
}

/**
 * Converte XML de resposta da Maxx API para objeto JavaScript
 */
export function parseXmlResponse<T = any>(xmlString: string): MaxxXmlResponse<T> {
  try {
    // Remove namespaces e limpa o XML
    const cleanXml = xmlString
      .replace(/<\?xml[^>]*\?>/, '')
      .replace(/xmlns[^=]*="[^"]*"/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    // Parser simples para o formato específico da Maxx API
    const apiMatch = cleanXml.match(/<api>(.*?)<\/api>/s);
    if (!apiMatch) {
      throw new Error('Formato XML inválido: tag <api> não encontrada');
    }

    const apiContent = apiMatch[1];
    const responseMatch = apiContent.match(/<response>(.*?)<\/response>/s);
    
    if (!responseMatch) {
      throw new Error('Formato XML inválido: tag <response> não encontrada');
    }

    const responseContent = responseMatch[1];
    const parsedResponse = parseResponseContent(responseContent);

    return {
      api: {
        response: parsedResponse
      }
    };
  } catch (error) {
    console.error('Erro ao fazer parse do XML:', error);
    throw new Error(`Falha ao processar resposta XML: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
  }
}

/**
 * Faz parse do conteúdo da tag <response>
 */
function parseResponseContent(content: string): MaxxApiResponse {
  const result: any = {};

  // Extrai campos simples
  const simpleFields = ['error', 'msg', 'token'];
  simpleFields.forEach(field => {
    const regex = new RegExp(`<${field}>(.*?)</${field}>`, 's');
    const match = content.match(regex);
    if (match) {
      const value = match[1].trim();
      // Converte para número se possível
      if (field === 'error') {
        result[field] = parseInt(value, 10);
      } else {
        result[field] = value;
      }
    }
  });

  // Extrai itens (array)
  const itemMatches = content.match(/<item>(.*?)<\/item>/gs);
  if (itemMatches) {
    if (itemMatches.length === 1) {
      // Apenas um item
      result.item = parseItemContent(itemMatches[0]);
    } else {
      // Múltiplos itens
      result.items = itemMatches.map(itemXml => parseItemContent(itemXml));
    }
  }

  return result;
}

/**
 * Faz parse do conteúdo de um item
 */
function parseItemContent(itemXml: string): any {
  const item: any = {};
  
  // Remove as tags <item> e </item>
  const content = itemXml.replace(/<\/?item>/g, '').trim();

  // Extrai todos os campos do item
  const fieldRegex = /<(\w+)>(.*?)<\/\1>/gs;
  let match;

  while ((match = fieldRegex.exec(content)) !== null) {
    const fieldName = match[1];
    let fieldValue = match[2].trim();

    // Converte para número se for campo numérico
    if (['id', 'tipo_cadastro', 'tipo_conta', 'operacao', 'variacao', 'indicante_id', 'id_nivel', 'cancelado', 'confirmado', 'id_cadastro', 'id_consumidor', 'id_cadastro_entrega', 'id_loja', 'id_categoria'].includes(fieldName)) {
      fieldValue = parseInt(fieldValue, 10);
    }
    
    // Converte para float se for campo monetário
    else if (['valor', 'valor_frete', 'valor_desconto', 'valor_creditos', 'peso_total', 'pontos', 'saldo_creditos'].includes(fieldName)) {
      fieldValue = parseFloat(fieldValue.replace(',', '.'));
    }

    item[fieldName] = fieldValue;
  }

  return item;
}

/**
 * Converte objeto para XML (função auxiliar)
 */
function objectToXml(obj: any, indent: string = ''): string {
  let xml = '';

  for (const [key, value] of Object.entries(obj)) {
    if (value === null || value === undefined) {
      continue;
    }

    if (typeof value === 'object' && !Array.isArray(value)) {
      xml += `${indent}<${key}>\n`;
      xml += objectToXml(value, indent + '  ');
      xml += `${indent}</${key}>\n`;
    } else if (Array.isArray(value)) {
      value.forEach(item => {
        xml += `${indent}<${key}>\n`;
        if (typeof item === 'object') {
          xml += objectToXml(item, indent + '  ');
        } else {
          xml += `${indent}  ${item}\n`;
        }
        xml += `${indent}</${key}>\n`;
      });
    } else {
      xml += `${indent}<${key}>${value}</${key}>\n`;
    }
  }

  return xml;
}

/**
 * Valida se o XML está no formato esperado
 */
export function validateXmlFormat(xmlString: string): boolean {
  try {
    const cleanXml = xmlString.trim();
    return cleanXml.includes('<api>') && 
           cleanXml.includes('</api>') && 
           cleanXml.includes('<response>') && 
           cleanXml.includes('</response>');
  } catch {
    return false;
  }
}

/**
 * Extrai código de erro do XML
 */
export function extractErrorCode(xmlString: string): number | null {
  try {
    const errorMatch = xmlString.match(/<error>(\d+)<\/error>/);
    return errorMatch ? parseInt(errorMatch[1], 10) : null;
  } catch {
    return null;
  }
}
