"use client"

import { Area, AreaChart, Bar, BarChart, Label, PolarRadiusAxis, RadialBar, RadialBarChart, XAxis, YAxis } from "recharts"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

// Sample data
const gatesData = [
  { id: 1, name: "الباب 1", capacity: 100, currentPpl: 70 },
  { id: 2, name: "الباب 2", capacity: 120, currentPpl: 90 },
  { id: 3, name: "الباب 3", capacity: 80, currentPpl: 60 },
]

const pathsData = [
  { id: 1, name: "الممر 1", capacity: 50, currentPpl: 10 },
  { id: 2, name: "الممر 2", capacity: 60, currentPpl: 48 },
  { id: 3, name: "الممر 3", capacity: 40, currentPpl: 15 },
  { id: 4, name: "الممر 4", capacity: 55, currentPpl: 52 },
  { id: 5, name: "الممر 5", capacity: 65, currentPpl: 20 },
  { id: 6, name: "الممر 6", capacity: 45, currentPpl: 40 },
  { id: 7, name: "الممر 7", capacity: 70, currentPpl: 7 },
  { id: 8, name: "الممر 8", capacity: 50, currentPpl: 47 },
]

const arrivalData = [
  { time: "منذ 40 دقيقة", arrivals: 0 },
  { time: "منذ 30 دقيقة", arrivals: 10 },
  { time: "منذ 20 دقيقة", arrivals: 40 },
  { time: "منذ 10 دقيقة", arrivals: 70 },
  { time: "منذ 5 دقائق", arrivals: 80 },
]

// Transform data for charts
const pathsBarData = pathsData.map(path => ({
  name: path.name,
  current: path.currentPpl,
  remaining: path.capacity - path.currentPpl,
}))

const chartConfig = {
  arrivals: {
    label: "عدد الواصلين",
    color: "#2563eb",
  },
  current: {
    label: "الحالي",
    color: "#2563eb",
  },
  remaining: {
    label: "المتبقي",
    color: "#ffffff",
  },
} satisfies ChartConfig

export function Dashboard() {
  return (
    <div dir="rtl" className="dark bg-slate-900 text-white min-h-screen p-6">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-400">لوحة التحكم</h1>
      <div className="space-y-6 w-full">
        {/* First Row: Arrival Area Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-300">منحنى الوصول</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <AreaChart data={arrivalData}>
                <XAxis dataKey="time" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area
                  type="monotone"
                  dataKey="arrivals"
                  stroke="#2563eb"
                  fill="#2563eb"
                  fillOpacity={0.6}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Second Row: Gates Radial Bars */}
        <div className="grid grid-cols-3 gap-4">
          {gatesData.map((gate) => {
            const chartData = [{ month: gate.name, current: gate.currentPpl, remaining: gate.capacity - gate.currentPpl }]
            const totalCapacity = gate.capacity
            const currentPercentage = Math.round((gate.currentPpl / gate.capacity) * 100)
            return (
              <Card key={gate.id} className="flex flex-col">
                <CardHeader className="items-center pb-0">
                  <CardTitle className="text-blue-300">{gate.name}</CardTitle>
                  <CardDescription>السعة الكلية: {totalCapacity}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 items-center pb-0">
                  <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[250px]"
                  >
                    <RadialBarChart
                      data={chartData}
                      endAngle={180}
                      innerRadius={80}
                      outerRadius={130}
                    >
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent hideLabel />}
                      />
                      <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                        <Label
                          content={({ viewBox }) => {
                            if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                              return (
                                <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) - 16}
                                    className="fill-foreground text-2xl font-bold"
                                  >
                                    {currentPercentage}%
                                  </tspan>
                                  <tspan
                                    x={viewBox.cx}
                                    y={(viewBox.cy || 0) + 4}
                                    className="fill-muted-foreground"
                                  >
                                    ازدحام
                                  </tspan>
                                </text>
                              )
                            }
                          }}
                        />
                      </PolarRadiusAxis>
                      <RadialBar
                        dataKey="current"
                        stackId="a"
                        cornerRadius={5}
                        fill="#2563eb"
                        className="stroke-transparent stroke-2"
                      />
                      <RadialBar
                        dataKey="remaining"
                        fill="#e5e7eb"
                        stackId="a"
                        cornerRadius={5}
                        className="stroke-transparent stroke-2"
                      />
                    </RadialBarChart>
                  </ChartContainer>
                </CardContent>
                <CardFooter className="flex-col gap-2 text-sm">
                  <div className="text-muted-foreground leading-none">
                    الحالي: {gate.currentPpl} | المتبقي: {gate.capacity - gate.currentPpl}
                  </div>
                </CardFooter>
              </Card>
            )
          })}
        </div>

        {/* Third Row: Paths Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-300">الممرات</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px] w-full">
              <BarChart data={pathsBarData}>
                <XAxis dataKey="name" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar
                  dataKey="current"
                  stackId="a"
                  fill="#2563eb"
                  radius={[0, 0, 4, 4]}
                />
                <Bar
                  dataKey="remaining"
                  stackId="a"
                  fill="#ffffff"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Dashboard