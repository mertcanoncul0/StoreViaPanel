import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { DashboardCardProps } from "../types"
import prisma from "../db"
import { formatCurrency, formatNumber } from "@/lib/formatters"

async function getSalesData() {
  const data = await prisma.order.aggregate({
    _sum: { pricePaidInCents: true },
    _count: true,
  })

  return {
    amount: (data._sum.pricePaidInCents || 0) / 100,
    numberOfSales: data._count,
  }
}

async function getUserData() {
  const [userCount, orderData] = await Promise.all([
    prisma.user.count(),
    prisma.order.aggregate({
      _sum: { pricePaidInCents: true },
    }),
  ])

  return {
    userCount,
    avarageValuePerUser:
      userCount === 0
        ? 0
        : (orderData._sum.pricePaidInCents || 0) / userCount / 100,
  }
}

async function getProductData() {
  const [activeCount, inactiveCount] = await Promise.all([
    prisma.product.count({ where: { isAvailableForPurchase: true } }),
    prisma.product.count({ where: { isAvailableForPurchase: false } }),
  ])

  return {
    activeCount,
    inactiveCount,
  }
}

export default async function AdminDashboard() {
  const [salesData, userData, productsData] = await Promise.all([
    getSalesData(),
    getUserData(),
    getProductData(),
  ])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <DashboardCard
        title="Sales"
        subtitle={`${formatNumber(salesData.numberOfSales)} Orders`}
        body={formatCurrency(salesData.amount)}
      />
      <DashboardCard
        title="Customer"
        subtitle={`${formatNumber(userData.avarageValuePerUser)} Avarage Value`}
        body={formatCurrency(userData.userCount)}
      />
      <DashboardCard
        title="Active Products"
        subtitle={`${formatNumber(productsData.inactiveCount)} Inactive`}
        body={formatNumber(productsData.activeCount)}
      />
    </div>
  )
}

function DashboardCard({ title, subtitle, body }: DashboardCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subtitle}</CardDescription>
      </CardHeader>

      <CardContent>
        <p>{body}</p>
      </CardContent>
    </Card>
  )
}
