import * as React from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

export interface FormTab {
  value: string
  label: string
  icon?: React.ReactNode
  disabled?: boolean
}

interface FormTabsProps {
  tabs: FormTab[]
  activeTab: string
  onTabChange: (value: string) => void
  className?: string
  tabContentClassName?: string
  children: React.ReactNode
}

export function FormTabs({
  tabs,
  activeTab,
  onTabChange,
  className,
  tabContentClassName,
  children,
}: FormTabsProps) {
  return (
    <Tabs 
      value={activeTab} 
      onValueChange={onTabChange}
      className={cn("w-full space-y-4", className)}
    >
      <TabsList className="w-full justify-start overflow-x-auto bg-muted/50 dark:bg-muted/20">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            disabled={tab.disabled}
            className="data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm"
          >
            {tab.icon && <span className="mr-2">{tab.icon}</span>}
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className={cn("w-full", tabContentClassName)}>
        {React.Children.map(children, (child, index) => {
          if (React.isValidElement(child) && child.props.value) {
            return (
              <TabsContent 
                value={child.props.value}
                className="mt-0"
              >
                {child}
              </TabsContent>
            )
          }
          return child
        })}
      </div>
    </Tabs>
  )
}
