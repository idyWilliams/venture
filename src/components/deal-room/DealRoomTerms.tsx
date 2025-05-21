"use client";

import { useEffect, useState } from "react";
import { DealTerms, DealType } from "@/src/lib/services/dealRoomService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/src/components/ui/label";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { useApiMutation } from "@/src/hooks/useApi";
import { Loader2, PenLine } from "lucide-react";

interface DealRoomTermsProps {
  terms: DealTerms;
  dealRoomId: string;
  projectName: string;
  currentUserId: string;
  currentUserRole: "founder" | "investor";
  status: string;
  onUpdateStatus: (newStatus: string) => void;
}

export default function DealRoomTerms({
  terms,
  dealRoomId,
  projectName,
  currentUserId,
  currentUserRole,
  status,
  onUpdateStatus,
}: DealRoomTermsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [localTerms, setLocalTerms] = useState<DealTerms>(terms || {});

  // Update localTerms if terms prop changes
  useEffect(() => {
    if (terms) {
      setLocalTerms(terms);
    }
  }, [terms]);

  // Mutation for updating deal terms
  const updateTermsMutation = useApiMutation<
    any,
    {
      dealRoomId: string;
      terms: DealTerms;
    }
  >("put", `/api/deal-rooms/${dealRoomId}/terms`, {
    invalidateQueries: [[`/api/deal-rooms/${dealRoomId}`]],
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateTermsMutation.mutate({
      dealRoomId,
      terms: localTerms,
    });
  };

  // Format currency
  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return "";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage
  const formatPercentage = (value?: number) => {
    if (value === undefined || value === null) return "";
    return `${value}%`;
  };

  // Handle input changes safely for numeric values
  const handleNumericChange = (field: keyof DealTerms, value: string) => {
    const parsedValue = value === "" ? undefined : parseFloat(value);
    setLocalTerms((prev) => ({
      ...prev,
      [field]: parsedValue,
    }));
  };

  // Render deal terms based on deal type
  const renderDealTerms = () => {
    const dealType = localTerms.dealType || "equity";

    switch (dealType) {
      case "equity":
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-1 text-gray-800">
                Investment Amount
              </h3>
              <p className="text-xl font-bold">
                {formatCurrency(localTerms.investmentAmount) || "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-800">Equity Offered</h3>
              <p className="text-xl font-bold">
                {formatPercentage(localTerms.equity) || "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-800">
                Company Valuation
              </h3>
              <p className="text-xl font-bold">
                {formatCurrency(localTerms.valuation) || "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-800">
                Minimum Investment
              </h3>
              <p className="text-xl font-bold">
                {formatCurrency(localTerms.minimumInvestment) ||
                  "Not specified"}
              </p>
            </div>
          </div>
        );

      case "convertible_note":
      case "safe":
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-1 text-gray-800">
                Investment Amount
              </h3>
              <p className="text-xl font-bold">
                {formatCurrency(localTerms.investmentAmount) || "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-800">Valuation Cap</h3>
              <p className="text-xl font-bold">
                {formatCurrency(localTerms.valuationCap) || "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-800">
                Conversion Discount
              </h3>
              <p className="text-xl font-bold">
                {formatPercentage(localTerms.conversionDiscount) ||
                  "Not specified"}
              </p>
            </div>
            {dealType === "convertible_note" && (
              <div>
                <h3 className="font-medium mb-1 text-gray-800">
                  Interest Rate
                </h3>
                <p className="text-xl font-bold">
                  {formatPercentage(localTerms.interestRate) || "Not specified"}
                </p>
              </div>
            )}
          </div>
        );

      case "revenue_share":
        return (
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="font-medium mb-1 text-gray-800">
                Investment Amount
              </h3>
              <p className="text-xl font-bold">
                {formatCurrency(localTerms.investmentAmount) || "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-800">
                Revenue Percentage
              </h3>
              <p className="text-xl font-bold">
                {formatPercentage(localTerms.revenuePercentage) ||
                  "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-800">Return Cap</h3>
              <p className="text-xl font-bold">
                {localTerms.returnCap !== undefined
                  ? `${localTerms.returnCap}x`
                  : "Not specified"}
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-1 text-gray-800">
                Payment Frequency
              </h3>
              <p className="text-xl font-bold capitalize">
                {localTerms.paymentFrequency || "Not specified"}
              </p>
            </div>
          </div>
        );

      default:
        return (
          <div>
            <p className="text-gray-600">
              No specific terms have been defined yet.
            </p>
          </div>
        );
    }
  };

  // Form for editing deal terms
  const renderEditForm = () => {
    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="dealType">Deal Type</Label>
            <Select
              value={localTerms.dealType || "equity"}
              onValueChange={(value: string) =>
                setLocalTerms((prev) => ({
                  ...prev,
                  dealType: value as DealType,
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select deal type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="equity">Equity</SelectItem>
                <SelectItem value="convertible_note">
                  Convertible Note
                </SelectItem>
                <SelectItem value="safe">SAFE</SelectItem>
                <SelectItem value="revenue_share">Revenue Share</SelectItem>
                <SelectItem value="grant">Grant</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Common fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="investmentAmount">Investment Amount (₦)</Label>
              <Input
                id="investmentAmount"
                type="number"
                value={localTerms.investmentAmount ?? ""}
                onChange={(e) =>
                  handleNumericChange("investmentAmount", e.target.value)
                }
              />
            </div>

            {/* Equity-specific fields */}
            {(localTerms.dealType === "equity" || !localTerms.dealType) && (
              <>
                <div>
                  <Label htmlFor="equity">Equity Percentage (%)</Label>
                  <Input
                    id="equity"
                    type="number"
                    step="0.01"
                    value={localTerms.equity ?? ""}
                    onChange={(e) =>
                      handleNumericChange("equity", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="valuation">Company Valuation (₦)</Label>
                  <Input
                    id="valuation"
                    type="number"
                    value={localTerms.valuation ?? ""}
                    onChange={(e) =>
                      handleNumericChange("valuation", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="minimumInvestment">
                    Minimum Investment (₦)
                  </Label>
                  <Input
                    id="minimumInvestment"
                    type="number"
                    value={localTerms.minimumInvestment ?? ""}
                    onChange={(e) =>
                      handleNumericChange("minimumInvestment", e.target.value)
                    }
                  />
                </div>
              </>
            )}

            {/* Convertible note / SAFE fields */}
            {(localTerms.dealType === "convertible_note" ||
              localTerms.dealType === "safe") && (
              <>
                <div>
                  <Label htmlFor="valuationCap">Valuation Cap (₦)</Label>
                  <Input
                    id="valuationCap"
                    type="number"
                    value={localTerms.valuationCap ?? ""}
                    onChange={(e) =>
                      handleNumericChange("valuationCap", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="conversionDiscount">
                    Conversion Discount (%)
                  </Label>
                  <Input
                    id="conversionDiscount"
                    type="number"
                    step="0.01"
                    value={localTerms.conversionDiscount ?? ""}
                    onChange={(e) =>
                      handleNumericChange("conversionDiscount", e.target.value)
                    }
                  />
                </div>
                {localTerms.dealType === "convertible_note" && (
                  <div>
                    <Label htmlFor="interestRate">Interest Rate (%)</Label>
                    <Input
                      id="interestRate"
                      type="number"
                      step="0.01"
                      value={localTerms.interestRate ?? ""}
                      onChange={(e) =>
                        handleNumericChange("interestRate", e.target.value)
                      }
                    />
                  </div>
                )}
              </>
            )}

            {/* Revenue share specific fields */}
            {localTerms.dealType === "revenue_share" && (
              <>
                <div>
                  <Label htmlFor="revenuePercentage">
                    Revenue Percentage (%)
                  </Label>
                  <Input
                    id="revenuePercentage"
                    type="number"
                    step="0.01"
                    value={localTerms.revenuePercentage ?? ""}
                    onChange={(e) =>
                      handleNumericChange("revenuePercentage", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="returnCap">Return Cap (multiplier)</Label>
                  <Input
                    id="returnCap"
                    type="number"
                    step="0.1"
                    value={localTerms.returnCap ?? ""}
                    onChange={(e) =>
                      handleNumericChange("returnCap", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="paymentFrequency">Payment Frequency</Label>
                  <Select
                    value={localTerms.paymentFrequency || "monthly"}
                    onValueChange={(value: string) =>
                      setLocalTerms((prev) => ({
                        ...prev,
                        paymentFrequency: value as
                          | "monthly"
                          | "quarterly"
                          | "annually",
                      }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="monthly">Monthly</SelectItem>
                      <SelectItem value="quarterly">Quarterly</SelectItem>
                      <SelectItem value="annually">Annually</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
          </div>

          <div>
            <Label htmlFor="additionalTerms">Additional Terms or Notes</Label>
            <Textarea
              id="additionalTerms"
              value={localTerms.additionalTerms || ""}
              onChange={(e) =>
                setLocalTerms((prev) => ({
                  ...prev,
                  additionalTerms: e.target.value,
                }))
              }
              rows={4}
            />
          </div>
        </div>

        <div className="flex space-x-2">
          <Button type="submit" disabled={updateTermsMutation.isPending}>
            {updateTermsMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Save Terms
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setLocalTerms(terms || {});
              setIsEditing(false);
            }}
          >
            Cancel
          </Button>
        </div>
      </form>
    );
  };

  // Check if terms is empty
  const isTermsEmpty =
    !terms || Object.keys(terms).filter((k) => k !== "dealType").length === 0;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Deal Terms</h2>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            disabled={isEditing}
            onClick={() => setIsEditing(true)}
          >
            <PenLine className="h-4 w-4 mr-2" />
            {isTermsEmpty ? "Propose Terms" : "Edit Terms"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {localTerms.dealType ? (
              <>
                {localTerms.dealType === "equity" && "Equity Investment"}
                {localTerms.dealType === "convertible_note" &&
                  "Convertible Note"}
                {localTerms.dealType === "safe" &&
                  "Simple Agreement for Future Equity (SAFE)"}
                {localTerms.dealType === "revenue_share" &&
                  "Revenue Share Agreement"}
                {localTerms.dealType === "grant" && "Grant Funding"}
                {localTerms.dealType === "other" && "Custom Deal Structure"}
              </>
            ) : (
              "Investment Terms"
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            renderEditForm()
          ) : (
            <>
              {!isTermsEmpty ? (
                <div className="space-y-6">
                  {renderDealTerms()}

                  {localTerms.additionalTerms && (
                    <div className="mt-6 pt-6 border-t">
                      <h3 className="font-medium mb-2 text-gray-800">
                        Additional Terms & Notes
                      </h3>
                      <p className="text-gray-700 whitespace-pre-line">
                        {localTerms.additionalTerms}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-gray-500 mb-4">
                    No deal terms have been proposed yet.
                  </p>
                  <Button onClick={() => setIsEditing(true)}>
                    Propose Terms
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {!isEditing && !isTermsEmpty && (
        <Card>
          <CardHeader>
            <CardTitle>Deal Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <RadioGroup
                value={status}
                onValueChange={(value) => {
                  if (value !== status) {
                    onUpdateStatus(value);
                  }
                }}
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="pending" id="pending" />
                  <Label htmlFor="pending">Pending - Initial Discussion</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="negotiation" id="negotiation" />
                  <Label htmlFor="negotiation">
                    In Negotiation - Actively Discussing Terms
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="due_diligence" id="due_diligence" />
                  <Label htmlFor="due_diligence">
                    Due Diligence - Verifying Information
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="signed" id="signed" />
                  <Label htmlFor="signed">
                    Terms Signed - Awaiting Closing
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="closed" id="closed" />
                  <Label htmlFor="closed">
                    Deal Closed - Investment Complete
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="rejected" id="rejected" />
                  <Label htmlFor="rejected">
                    Rejected - Not Moving Forward
                  </Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
