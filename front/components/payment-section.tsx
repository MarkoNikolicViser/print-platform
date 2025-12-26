"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { CreditCard, Smartphone, Building2, CheckCircle, AlertCircle, Lock } from "lucide-react"

interface PaymentMethod {
  id: string
  name: string
  description: string
  icon: React.ReactNode
  fee: number
  processingTime: string
}

interface OrderSummary {
  shopName: string
  shopAddress: string
  totalCost: number
  email?: string
  fileInfo: {
    name: string
    pages: number
  }
  printConfig: {
    quantity: number
    copies: number
    isColor: boolean
    isDoubleSided: boolean
    paperSize: string
    binding: string
  }
}

const paymentMethods: PaymentMethod[] = [
  {
    id: "card",
    name: "Platna kartica",
    description: "Visa, MasterCard, Dina",
    icon: <CreditCard className="w-5 h-5" />,
    fee: 0,
    processingTime: "Trenutno",
  },
  {
    id: "mbanking",
    name: "m-Banking",
    description: "Komercijalna, Intesa, Raiffeisen",
    icon: <Smartphone className="w-5 h-5" />,
    fee: 0,
    processingTime: "1-2 min",
  },
  {
    id: "bank_transfer",
    name: "Bankovna doznaka",
    description: "Prenos na račun štamparije",
    icon: <Building2 className="w-5 h-5" />,
    fee: 0,
    processingTime: "1-24h",
  },
]

interface PaymentSectionProps {
  orderSummary: OrderSummary
  onPaymentComplete: (paymentId: string) => void
  onCancel: () => void
}

export function PaymentSection({ orderSummary, onPaymentComplete, onCancel }: PaymentSectionProps) {
  const [selectedMethod, setSelectedMethod] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentComplete, setPaymentComplete] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })

  const selectedPaymentMethod = paymentMethods.find((method) => method.id === selectedMethod)
  const totalWithFees = orderSummary.totalCost + (selectedPaymentMethod?.fee || 0)

  const handlePayment = async () => {
    if (!selectedMethod) return

    setIsProcessing(true)

    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setPaymentComplete(true)

      // Generate payment ID
      const paymentId = `PS${Date.now()}`

      const userData = localStorage.getItem("user")
      if (userData) {
        const user = JSON.parse(userData)
        const newOrder = {
          id: paymentId,
          fileName: orderSummary.fileInfo.name,
          copies: orderSummary.printConfig.quantity,
          color: orderSummary.printConfig.isColor,
          doubleSided: orderSummary.printConfig.isDoubleSided,
          shopName: orderSummary.shopName,
          totalPrice: totalWithFees,
          status: "pending" as const,
          orderDate: new Date().toISOString().split("T")[0],
        }

        // Add order to user's order history
        const existingOrders = user.orders || []
        user.orders = [newOrder, ...existingOrders]
        localStorage.setItem("user", JSON.stringify(user))
      }

      setTimeout(() => {
        onPaymentComplete(paymentId)
      }, 2000)
    }, 3000)
  }

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }
    return v
  }

  if (paymentComplete) {
    return (
      <Card className="serbian-card">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold text-primary mb-2">Plaćanje uspešno!</h2>
          <p className="text-muted-foreground mb-4">Vaša narudžbina je primljena i obrađuje se.</p>
          <div className="p-4 bg-muted rounded-lg mb-4">
            <p className="text-sm">
              <strong>ID narudžbine:</strong> PS{Date.now()}
            </p>
            <p className="text-sm">
              <strong>Štamparija:</strong> {orderSummary.shopName}
            </p>
            <p className="text-sm">
              <strong>Ukupno plaćeno:</strong> {totalWithFees} RSD
            </p>
          </div>
          {orderSummary.email && (
            <p className="text-sm text-muted-foreground">Poslali smo potvrdu na {orderSummary.email}</p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="serbian-card">
      <CardHeader>
        <CardTitle className="text-primary text-lg font-bold uppercase flex items-center gap-2">
          <Lock className="w-5 h-5" />
          Plaćanje
        </CardTitle>
        <p className="text-sm text-muted-foreground">Izaberite način plaćanja i završite narudžbinu</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Order Summary */}
        <div className="p-4 bg-muted rounded-lg border border-primary">
          <h3 className="font-semibold text-primary mb-3">Rezime narudžbine</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Štamparija:</span>
              <span className="font-medium">{orderSummary.shopName}</span>
            </div>
            <div className="flex justify-between">
              <span>Fajl:</span>
              <span className="font-medium">{orderSummary.fileInfo.name}</span>
            </div>
            <div className="flex justify-between">
              <span>Stranica:</span>
              <span>{orderSummary.fileInfo.pages}</span>
            </div>
            <div className="flex justify-between">
              <span>Primerci:</span>
              <span>{orderSummary.printConfig.quantity}</span>
            </div>
            <div className="flex justify-between">
              <span>Kopije:</span>
              <span>{orderSummary.printConfig.copies}</span>
            </div>
            <div className="flex justify-between">
              <span>Opcije:</span>
              <div className="text-right">
                {orderSummary.printConfig.isColor && (
                  <Badge variant="outline" className="text-xs mr-1">
                    Boja
                  </Badge>
                )}
                {orderSummary.printConfig.isDoubleSided && (
                  <Badge variant="outline" className="text-xs mr-1">
                    Obostrano
                  </Badge>
                )}
                {orderSummary.printConfig.binding !== "none" && (
                  <Badge variant="outline" className="text-xs">
                    Povezivanje
                  </Badge>
                )}
              </div>
            </div>
            <Separator />
            <div className="flex justify-between font-semibold">
              <span>Ukupno:</span>
              <span>{orderSummary.totalCost} RSD</span>
            </div>
            {selectedPaymentMethod?.fee > 0 && (
              <div className="flex justify-between text-muted-foreground">
                <span>Provizija:</span>
                <span>+{selectedPaymentMethod.fee} RSD</span>
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-accent">
              <span>Za plaćanje:</span>
              <span>{totalWithFees} RSD</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3">
          <Label className="text-primary font-medium uppercase text-sm">Način plaćanja:</Label>
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            {paymentMethods.map((method) => (
              <div key={method.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-muted">
                <RadioGroupItem value={method.id} id={method.id} />
                <div className="flex items-center space-x-3 flex-1">
                  <div className="p-2 bg-primary/10 rounded">{method.icon}</div>
                  <div className="flex-1">
                    <Label htmlFor={method.id} className="font-medium cursor-pointer">
                      {method.name}
                    </Label>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                    <p className="text-xs text-muted-foreground">Vreme obrade: {method.processingTime}</p>
                  </div>
                  <div className="text-right">
                    {method.fee > 0 ? (
                      <Badge variant="outline">+{method.fee} RSD</Badge>
                    ) : (
                      <Badge variant="secondary">Besplatno</Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Payment Details */}
        {selectedMethod === "card" && (
          <div className="space-y-4 p-4 border rounded-lg">
            <h4 className="font-semibold text-primary">Detalji kartice</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="card-name" className="text-sm font-medium">
                  Ime na kartici
                </Label>
                <Input
                  id="card-name"
                  value={cardDetails.name}
                  onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  placeholder="Marko Petrović"
                  className="serbian-input"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="card-number" className="text-sm font-medium">
                  Broj kartice
                </Label>
                <Input
                  id="card-number"
                  value={cardDetails.number}
                  onChange={(e) => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                  className="serbian-input"
                />
              </div>
              <div>
                <Label htmlFor="card-expiry" className="text-sm font-medium">
                  Datum isteka
                </Label>
                <Input
                  id="card-expiry"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })}
                  placeholder="MM/GG"
                  maxLength={5}
                  className="serbian-input"
                />
              </div>
              <div>
                <Label htmlFor="card-cvv" className="text-sm font-medium">
                  CVV
                </Label>
                <Input
                  id="card-cvv"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, "") })}
                  placeholder="123"
                  maxLength={4}
                  type="password"
                  className="serbian-input"
                />
              </div>
            </div>
          </div>
        )}

        {selectedMethod === "bank_transfer" && (
          <div className="p-4 border rounded-lg bg-muted">
            <h4 className="font-semibold text-primary mb-2">Podaci za doznaku</h4>
            <div className="text-sm space-y-1">
              <p>
                <strong>Primalac:</strong> {orderSummary.shopName}
              </p>
              <p>
                <strong>Račun:</strong> 160-5000001234567-89
              </p>
              <p>
                <strong>Poziv na broj:</strong> PS{Date.now()}
              </p>
              <p>
                <strong>Iznos:</strong> {totalWithFees} RSD
              </p>
            </div>
            <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              Štampanje će početi nakon prijema uplate (1-24h)
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel} className="flex-1 bg-transparent">
            Otkaži
          </Button>
          <Button onClick={handlePayment} disabled={!selectedMethod || isProcessing} className="serbian-button flex-1">
            {isProcessing ? "Obrađuje se..." : `Plati ${totalWithFees} RSD`}
          </Button>
        </div>

        {isProcessing && (
          <div className="text-center">
            <div className="text-sm text-muted-foreground mb-2">Obrađuje se plaćanje...</div>
            <div className="w-full bg-muted rounded-full h-2">
              <div className="bg-accent h-2 rounded-full animate-pulse" style={{ width: "70%" }}></div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="text-xs text-muted-foreground text-center p-3 bg-muted rounded">
          <Lock className="w-3 h-3 inline mr-1" />
          Svi podaci su zaštićeni SSL enkripcijom. Vaši podaci o kartici se ne čuvaju.
        </div>
      </CardContent>
    </Card>
  )
}
