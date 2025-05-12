"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SubscriptionFormProps {
  isCollectorMode: boolean
}

export default function SubscriptionForm({
  isCollectorMode,
}: SubscriptionFormProps) {
  const [email, setEmail] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log({ firstName, lastName, email })
  }

  return (
    <Card className="bg-primary/3 w-full shadow-none">
      <CardHeader className="space-y-2">
        <CardTitle className="text-2xl font-bold">
          Want to Learn More?
        </CardTitle>
        <CardDescription className="text-base">
          {isCollectorMode
            ? "Subscribe and receive a free guide on how to build and maintain your collection, including tips on authentication and preservation."
            : "Subscribe and receive a free e-book packed with everything you need to know about finding profitable items to flip."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="md:grid-cols-2 grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="bg-popover h-10"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="bg-popover h-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-popover h-10"
              required
            />
          </div>
          <Button type="submit" className="w-full">
            Subscribe Now
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
