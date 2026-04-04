import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { DocumentSettings, Profile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, LayoutTemplate, LockOpen, Loader2 } from "lucide-react";
import { SavedStylesDialog } from "./saved-styles-dialog";
import { useState } from "react";
import { getSubscriptionAccessState, type SubscriptionSnapshot } from "@/lib/subscription-access";
import { createRazorpayOrder, verifyRazorpayPayment } from "@/utils/actions/payments/actions";

interface DocumentSettingsFormProps {
  documentSettings: DocumentSettings;
  onChange: (field: 'document_settings', value: DocumentSettings) => void;
  profile: Profile;
  showWatermark?: boolean;
  resumeId: string;
}

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min: number
  max: number
  step: number
}

function NumberInput({ value, onChange, min, max, step }: NumberInputProps) {
  const increment = () => {
    const newValue = Math.min(max, value + step)
    onChange(Number(newValue.toFixed(2)))
  }

  const decrement = () => {
    const newValue = Math.max(min, value - step)
    onChange(Number(newValue.toFixed(2)))
  }

  const displayValue = Number(value.toFixed(2))

  return (
    <div className="flex items-center space-x-1">
      <span className="text-xs text-muted-foreground/60 w-8">{displayValue}</span>
      <div className="flex flex-col">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-4 w-4 hover:bg-slate-100"
          onClick={increment}
        >
          <ChevronUp className="h-3 w-3" />
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-4 w-4 hover:bg-slate-100"
          onClick={decrement}
        >
          <ChevronDown className="h-3 w-3" />
        </Button>
      </div>
    </div>
  )
}

export function DocumentSettingsForm({ documentSettings, onChange, profile, showWatermark = false, resumeId }: DocumentSettingsFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const subscriptionAccess = getSubscriptionAccessState(profile as unknown as SubscriptionSnapshot);
  const { hasProAccess, hasWatermarkAccess } = subscriptionAccess;

  const startPayment = async () => {
    if (hasProAccess || hasWatermarkAccess) return;
    setIsLoading(true);

    try {
      const loaded = await new Promise<boolean>((resolve) => {
        if ((window as Window & { Razorpay?: unknown }).Razorpay) return resolve(true);
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.onload = () => resolve(true);
        script.onerror = () => resolve(false);
        document.body.appendChild(script);
      });
      if (!loaded) throw new Error('Failed to load Razorpay');

      const order = await createRazorpayOrder('watermark', resumeId);
      const RazorpayCtor = (window as Window & { Razorpay?: new (options: Record<string, unknown>) => { open: () => void } }).Razorpay;
      if (!RazorpayCtor) throw new Error('Razorpay unavailable');

      const instance = new RazorpayCtor({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'ResuSync',
        description: 'Remove watermark (Rs 49)',
        theme: { color: '#18181b' },
        handler: async (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) => {
          await verifyRazorpayPayment({ purpose: 'watermark', ...response, resumeId });
          window.location.reload();
        },
      });
      instance.open();
    } catch (e) {
      console.error('Payment error:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const defaultSettings = {
    document_font_size: 10,
    document_line_height: 1.5,
    document_margin_vertical: 36,
    document_margin_horizontal: 36,
    header_name_size: 24,
    header_name_bottom_spacing: 24,
    skills_margin_top: 2,
    skills_margin_bottom: 2,
    skills_margin_horizontal: 0,
    skills_item_spacing: 2,
    experience_margin_top: 2,
    experience_margin_bottom: 2,
    experience_margin_horizontal: 0,
    experience_item_spacing: 4,
    projects_margin_top: 2,
    projects_margin_bottom: 2,
    projects_margin_horizontal: 0,
    projects_item_spacing: 4,
    education_margin_top: 2,
    education_margin_bottom: 2,
    education_margin_horizontal: 0,
    education_item_spacing: 4,
  };

  if (!documentSettings) {
    onChange('document_settings', defaultSettings);
    return null;
  }

  const handleSettingsChange = (newSettings: DocumentSettings) => {
    onChange('document_settings', newSettings);
  };

  const handleFontSizeChange = (value: number) => {
    const newSettings: DocumentSettings = {
      ...documentSettings,
      document_font_size: value
    };
    handleSettingsChange(newSettings);
  };

  const SectionSettings = ({ title, section }: { title: string; section: 'skills' | 'experience' | 'projects' | 'education' }) => {
    const marginTopKey = `${section}_margin_top` as keyof DocumentSettings;
    const marginBottomKey = `${section}_margin_bottom` as keyof DocumentSettings;
    const marginHorizontalKey = `${section}_margin_horizontal` as keyof DocumentSettings;
    const itemSpacingKey = `${section}_item_spacing` as keyof DocumentSettings;

    return (
      <div className="space-y-4 bg-slate-50/50 rounded-lg border border-slate-200/50 p-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Space Above {title} Section</Label>
            <div className="flex items-center">
              <NumberInput
                value={Number(documentSettings[marginTopKey]) ?? 2}
                min={0}
                max={48}
                step={1}
                onChange={(value) => 
                  handleSettingsChange({
                    ...documentSettings,
                    [marginTopKey]: value
                  })
                }
              />
              <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
            </div>
          </div>
          <Slider
            value={[Number(documentSettings[marginTopKey] ?? 2)]}
            min={0}
            max={48}
            step={1}
            onValueChange={([value]) => 
              handleSettingsChange({
                ...documentSettings,
                [marginTopKey]: value
              })
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Space Below {title} Section</Label>
            <div className="flex items-center">
              <NumberInput
                value={Number(documentSettings[marginBottomKey]) ?? 2}
                min={0}
                max={48}
                step={1}
                onChange={(value) => 
                  handleSettingsChange({
                    ...documentSettings,
                    [marginBottomKey]: value
                  })
                }
              />
              <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
            </div>
          </div>
          <Slider
            value={[Number(documentSettings[marginBottomKey] ?? 2)]}
            min={0}
            max={48}
            step={1}
            onValueChange={([value]) => 
              handleSettingsChange({
                ...documentSettings,
                [marginBottomKey]: value
              })
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Horizontal Margins</Label>
            <div className="flex items-center">
              <NumberInput
                value={Number(documentSettings[marginHorizontalKey]) ?? 0}
                min={0}
                max={72}
                step={2}
                onChange={(value) => 
                  handleSettingsChange({
                    ...documentSettings,
                    [marginHorizontalKey]: value
                  })
                }
              />
              <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
            </div>
          </div>
          <Slider
            value={[Number(documentSettings[marginHorizontalKey] ?? 0)]}
            min={0}
            max={72}
            step={2}
            onValueChange={([value]) => 
              handleSettingsChange({
                ...documentSettings,
                [marginHorizontalKey]: value
              })
            }
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium text-muted-foreground">Space Between Items</Label>
            <div className="flex items-center">
              <NumberInput
                value={Number(documentSettings[itemSpacingKey]) ?? 4}
                min={0}
                max={16}
                step={0.5}
                onChange={(value) => 
                  handleSettingsChange({
                    ...documentSettings,
                    [itemSpacingKey]: value
                  })
                }
              />
              <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
            </div>
          </div>
          <Slider
            value={[Number(documentSettings[itemSpacingKey] ?? 4)]}
            min={0}
            max={16}
            step={0.5}
            onValueChange={([value]) => 
              handleSettingsChange({
                ...documentSettings,
                [itemSpacingKey]: value
              })
            }
          />
        </div>
      </div>
    );
  };

  return (
    <div className="">
        <Card className="">
        <CardHeader className="flex flex-col space-y-4">
          <div className="flex items-center space-x-2 w-full">
            <SavedStylesDialog
              currentSettings={documentSettings || defaultSettings}
              onApplyStyle={(settings) => handleSettingsChange(settings)}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSettingsChange({...defaultSettings})}
              className="relative h-60 group p-0 overflow-hidden border-slate-200 hover:border-teal-600/40 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-cyan-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-full w-full flex flex-col items-center">
                <div className="w-full p-2 text-xs font-medium text-teal-600 border-b border-slate-200 bg-slate-50/80">
                  <LayoutTemplate className="w-3 h-3 inline-block mr-1" />
                  Default Layout
                </div>
              </div>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSettingsChange({
                ...documentSettings,
                header_name_size: 24,
                skills_margin_top: 0,
                document_font_size: 10,
                projects_margin_top: 0,
                skills_item_spacing: 0,
                document_line_height: 1.2,
                education_margin_top: 0,
                skills_margin_bottom: 2,
                experience_margin_top: 2,
                projects_item_spacing: 0,
                education_item_spacing: 0,
                projects_margin_bottom: 0,
                education_margin_bottom: 0,
                experience_item_spacing: 1,
                document_margin_vertical: 20,
                experience_margin_bottom: 0,
                skills_margin_horizontal: 0,
                document_margin_horizontal: 28,
                header_name_bottom_spacing: 16,
                projects_margin_horizontal: 0,
                education_margin_horizontal: 0,
                experience_margin_horizontal: 0
              })}
              className="relative h-60 group p-0 overflow-hidden border-slate-200 hover:border-pink-600/40 transition-colors"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-pink-50/50 to-rose-50/50 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="relative h-full w-full flex flex-col items-center">
                <div className="w-full p-2 text-xs font-medium text-pink-600 border-b border-slate-200 bg-slate-50/80">
                  <LayoutTemplate className="w-3 h-3 inline-block mr-1" />
                  Compact Layout
                </div>
              </div>
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {showWatermark && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Watermark
                </Label>
                <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
              </div>

              <div className="space-y-4 bg-slate-50/50 rounded-lg border border-slate-200/50 p-4">
                <div className="space-y-2">
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    Default watermark: <span className="font-mono text-slate-400">Hire-Ready Resume - ResuSync</span>
                  </p>
                  <p className="text-xs text-muted-foreground/70 leading-relaxed">
                    Free plan exports include this watermark. Remove it with a one-time Rs 49 payment, or upgrade to Pro (Rs 199) to remove it automatically.
                  </p>
                </div>
                
                <Button
                  type="button"
                  onClick={startPayment}
                  disabled={isLoading}
                  className="w-full h-9 text-xs font-bold bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <div className="flex items-center gap-2">
                      <LockOpen className="h-3 w-3" />
                      <span>Pay Rs 49 to Remove</span>
                    </div>
                  )}
                </Button>
              </div>
            </div>
          )}

          {/* Global Document Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Document</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>

            <div className="space-y-4 bg-slate-50/50 rounded-lg p-4 border border-slate-200/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Font Size</Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.document_font_size ?? 10}
                      min={8}
                      max={12}
                      step={0.5}
                      onChange={handleFontSizeChange}
                    />
                    <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.document_font_size ?? 10]}
                  min={8}
                  max={12}
                  step={0.5}
                  onValueChange={([value]) => 
                    handleSettingsChange({
                      ...documentSettings,
                      document_font_size: value
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Line Height</Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.document_line_height ?? 1.5}
                      min={1}
                      max={2}
                      step={0.1}
                      onChange={(value) => 
                        handleSettingsChange({
                          ...documentSettings,
                          document_line_height: value
                        })
                      }
                    />
                    <span className="text-xs text-muted-foreground/60 ml-1">x</span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.document_line_height ?? 1.5]}
                  min={1}
                  max={2}
                  step={0.1}
                  onValueChange={([value]) => 
                    handleSettingsChange({
                      ...documentSettings,
                      document_line_height: value
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Vertical Margins</Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.document_margin_vertical ?? 36}
                      min={18}
                      max={108}
                      step={2}
                      onChange={(value) => 
                        handleSettingsChange({
                          ...documentSettings,
                          document_margin_vertical: value
                        })
                      }
                    />
                    <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.document_margin_vertical ?? 36]}
                  min={18}
                  max={108}
                  step={2}
                  onValueChange={([value]) => 
                    handleSettingsChange({
                      ...documentSettings,
                      document_margin_vertical: value
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Horizontal Margins</Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.document_margin_horizontal ?? 36}
                      min={18}
                      max={108}
                      step={2}
                      onChange={(value) => 
                        handleSettingsChange({
                          ...documentSettings,
                          document_margin_horizontal: value
                        })
                      }
                    />
                    <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.document_margin_horizontal ?? 36]}
                  min={18}
                  max={108}
                  step={2}
                  onValueChange={([value]) => 
                    handleSettingsChange({
                      ...documentSettings,
                      document_margin_horizontal: value
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Header Settings */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Header</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>

            <div className="space-y-4 bg-slate-50/50 rounded-lg p-4 border border-slate-200/50">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Name Size</Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.header_name_size ?? 24}
                      min={0}
                      max={40}
                      step={1}
                      onChange={(value) => 
                        handleSettingsChange({
                          ...documentSettings,
                          header_name_size: value
                        })
                      }
                    />
                    <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.header_name_size ?? 24]}
                  min={0}
                  max={40}
                  step={1}
                  onValueChange={([value]) => 
                    handleSettingsChange({
                      ...documentSettings,
                      header_name_size: value
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-muted-foreground">Space Below Name</Label>
                  <div className="flex items-center">
                    <NumberInput
                      value={documentSettings?.header_name_bottom_spacing ?? 24}
                      min={0}
                      max={50}
                      step={1}
                      onChange={(value) => 
                        handleSettingsChange({
                          ...documentSettings,
                          header_name_bottom_spacing: value
                        })
                      }
                    />
                    <span className="text-xs text-muted-foreground/60 ml-1">pt</span>
                  </div>
                </div>
                <Slider
                  value={[documentSettings?.header_name_bottom_spacing ?? 24]}
                  min={0}
                  max={50}
                  step={1}
                  onValueChange={([value]) => 
                    handleSettingsChange({
                      ...documentSettings,
                      header_name_bottom_spacing: value
                    })
                  }
                />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-muted-foreground/40">Compact</span>
                  <span className="text-[10px] text-muted-foreground/40">Spacious</span>
                </div>
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Skills</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Skills" section="skills" />
          </div>

          {/* Experience Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Experience</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Experience" section="experience" />
          </div>

          {/* Projects Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Projects</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Projects" section="projects" />
          </div>

          {/* Education Section */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent">Education</Label>
              <div className="h-[1px] flex-1 mx-4 bg-gradient-to-r from-teal-200/20 via-cyan-200/20 to-transparent" />
            </div>
            <SectionSettings title="Education" section="education" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 