import React from "react";
import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

const stats = [
  { id: 1, label: "Total Orders", value: 1284, delta: "+8%" },
  { id: 2, label: "Revenue", value: "$42,300", delta: "+5%" },
  { id: 3, label: "Products", value: 342, delta: "-1%" },
  { id: 4, label: "Active Users", value: 912, delta: "+12%" },
];

const recentOrders = [
  {
    id: "#1001",
    customer: "Alice",
    total: "$120.00",
    status: "Paid",
    date: "2025-09-30",
  },
  {
    id: "#1000",
    customer: "Bob",
    total: "$45.00",
    status: "Pending",
    date: "2025-09-29",
  },
  {
    id: "#999",
    customer: "Charlie",
    total: "$220.00",
    status: "Shipped",
    date: "2025-09-28",
  },
];

const products = [
  { id: "p1", name: "Wireless Mouse", stock: 34 },
  { id: "p2", name: "Mechanical Keyboard", stock: 12 },
  { id: "p3", name: "USB-C Hub", stock: 0 },
];

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Overview of recent activity and statistics
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost">Export</Button>
          <Link href="/admin/products/new">
            <Button>Create Product</Button>
          </Link>
        </div>
      </div>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Card key={s.id} className="p-4">
            <CardHeader>
              <CardTitle className="text-sm">{s.label}</CardTitle>
              <CardDescription className="mt-2 text-2xl font-semibold">
                {s.value}
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <span className="text-sm text-muted-foreground">
                {s.delta} vs last period
              </span>
            </CardFooter>
          </Card>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders placed by customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-2">Order</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{o.id}</td>
                      <td className="px-3 py-2">{o.customer}</td>
                      <td className="px-3 py-2">{o.total}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            o.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : o.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {o.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/orders">
              <Button variant="ghost">View all orders</Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Low stock and recent products</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {products.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Stock: {p.stock}
                      </div>
                    </div>
                    <div>
                      <Button
                        variant={p.stock === 0 ? "destructive" : "ghost"}
                        size="sm"
                      >
                        Manage
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Active admins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Admin"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Admin User</div>
                  <div className="text-xs text-muted-foreground">Owner</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders placed by customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-2">Order</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{o.id}</td>
                      <td className="px-3 py-2">{o.customer}</td>
                      <td className="px-3 py-2">{o.total}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            o.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : o.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {o.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/orders">
              <Button variant="ghost">View all orders</Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Low stock and recent products</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {products.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Stock: {p.stock}
                      </div>
                    </div>
                    <div>
                      <Button
                        variant={p.stock === 0 ? "destructive" : "ghost"}
                        size="sm"
                      >
                        Manage
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Active admins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Admin"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Admin User</div>
                  <div className="text-xs text-muted-foreground">Owner</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
            <CardDescription>Latest orders placed by customers</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full table-auto text-sm">
                <thead>
                  <tr className="text-left text-muted-foreground">
                    <th className="px-3 py-2">Order</th>
                    <th className="px-3 py-2">Customer</th>
                    <th className="px-3 py-2">Total</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((o) => (
                    <tr key={o.id} className="border-t">
                      <td className="px-3 py-2 font-medium">{o.id}</td>
                      <td className="px-3 py-2">{o.customer}</td>
                      <td className="px-3 py-2">{o.total}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-1 text-xs ${
                            o.status === "Paid"
                              ? "bg-green-100 text-green-800"
                              : o.status === "Shipped"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {o.status}
                        </span>
                      </td>
                      <td className="px-3 py-2 text-muted-foreground">
                        {o.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/admin/orders">
              <Button variant="ghost">View all orders</Button>
            </Link>
          </CardFooter>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Products</CardTitle>
              <CardDescription>Low stock and recent products</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {products.map((p) => (
                  <li key={p.id} className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{p.name}</div>
                      <div className="text-xs text-muted-foreground">
                        Stock: {p.stock}
                      </div>
                    </div>
                    <div>
                      <Button
                        variant={p.stock === 0 ? "destructive" : "ghost"}
                        size="sm"
                      >
                        Manage
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Team</CardTitle>
              <CardDescription>Active admins</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="Admin"
                  />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Admin User</div>
                  <div className="text-xs text-muted-foreground">Owner</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
