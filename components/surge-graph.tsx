"use client"

import { useEffect, useState } from "react"
import {
  Chart,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  Line,
  LineChart,
  LinearScale,
  TimeScale,
} from "@/components/ui/chart"

// Generate mock data for the next 3 hours
const generateMockData = () => {
  const now = new Date()
  const data = []

  for (let i = 0; i < 12; i++) {
    const time = new Date(now.getTime() + i * 15 * 60 * 1000) // 15 minute intervals

    // Create a surge pattern that drops after 30 minutes
    let surgeFactor
    if (i < 2) {
      surgeFactor = 1.5 - Math.random() * 0.1 // High surge now
    } else if (i < 4) {
      surgeFactor = 1.3 - Math.random() * 0.1 // Slightly lower
    } else {
      surgeFactor = 1.0 + Math.random() * 0.2 // Normal pricing later
    }

    data.push({
      time: time,
      uber: Math.round(249 * surgeFactor),
      ola: Math.round(275 * (surgeFactor - 0.05)),
      rapido: Math.round(165 * (surgeFactor + 0.1)),
    })
  }

  return data
}

export function SurgeGraph() {
  const [data, setData] = useState<any[]>([])

  useEffect(() => {
    setData(generateMockData())
  }, [])

  if (data.length === 0) {
    return <div className="h-64 flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="h-64 w-full">
      <ChartContainer
        className="h-full w-full"
        config={{
          theme: {
            background: "transparent",
            text: "hsl(var(--foreground))",
            grid: "hsl(var(--border))",
          },
        }}
      >
        <Chart
          data={data}
          render={({ width, height }) => (
            <>
              <TimeScale dataKey="time" formatString="%H:%M" tickCount={6} position="bottom" />
              <LinearScale dataKey={["uber", "ola", "rapido"]} position="left" tickCount={5} formatString="₹%d" />

              <LineChart>
                <Line dataKey="uber" stroke="hsl(215, 100%, 50%)" strokeWidth={2} name="Uber" />
                <Line dataKey="ola" stroke="hsl(142, 76%, 36%)" strokeWidth={2} name="Ola" />
                <Line dataKey="rapido" stroke="hsl(358, 75%, 59%)" strokeWidth={2} name="Rapido" />
              </LineChart>

              <ChartTooltip>
                {({ dataPoint }) => (
                  <ChartTooltipContent
                    title={new Date(dataPoint.time).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    items={[
                      {
                        label: "Uber",
                        value: `₹${dataPoint.uber}`,
                        color: "hsl(215, 100%, 50%)",
                      },
                      {
                        label: "Ola",
                        value: `₹${dataPoint.ola}`,
                        color: "hsl(142, 76%, 36%)",
                      },
                      {
                        label: "Rapido",
                        value: `₹${dataPoint.rapido}`,
                        color: "hsl(358, 75%, 59%)",
                      },
                    ]}
                  />
                )}
              </ChartTooltip>
            </>
          )}
        />
      </ChartContainer>
    </div>
  )
}
