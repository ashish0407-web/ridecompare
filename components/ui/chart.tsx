import type * as React from "react"

export const Chart = ({
  data,
  render,
}: { data: any[]; render: ({ width, height }: { width: number; height: number }) => React.ReactNode }) => {
  const width = 400
  const height = 300
  return (
    <svg width={width} height={height}>
      {render({ width, height })}
    </svg>
  )
}

export const ChartContainer = ({
  className,
  config,
  children,
}: { className?: string; config?: any; children: React.ReactNode }) => {
  return <div className={className}>{children}</div>
}

export const ChartTooltip = ({ children }: { children: ({ dataPoint }: { dataPoint: any }) => React.ReactNode }) => {
  return <>{children({ dataPoint: {} })}</>
}

export const ChartTooltipContent = ({
  title,
  items,
}: { title: string; items: { label: string; value: string; color: string }[] }) => {
  return (
    <div>
      <div>{title}</div>
      {items.map((item, index) => (
        <div key={index}>
          <span>{item.label}:</span>
          <span>{item.value}</span>
        </div>
      ))}
    </div>
  )
}

export const LineChart = ({ children }: { children: React.ReactNode }) => {
  return <>{children}</>
}

export const Line = ({
  dataKey,
  stroke,
  strokeWidth,
  name,
}: { dataKey: string; stroke: string; strokeWidth: number; name: string }) => {
  return <></>
}

export const LinearScale = ({
  dataKey,
  position,
  tickCount,
  formatString,
}: { dataKey: string | string[]; position: string; tickCount: number; formatString: string }) => {
  return <></>
}

export const TimeScale = ({
  dataKey,
  formatString,
  tickCount,
  position,
}: { dataKey: string; formatString: string; tickCount: number; position: string }) => {
  return <></>
}
