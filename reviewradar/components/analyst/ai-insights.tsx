"use client";

import { useState } from "react";
import { generateAIInsights } from "@/app/actions/generate-insights";
import { FeedbackFilter } from "@/lib/validations";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Brain, Lightbulb, Loader2, AlertTriangle, RefreshCcw, Download, CheckCircle2, BarChart } from "lucide-react";
import { toast } from "sonner";

interface InsightsData {
  executiveSummary: string;
  sentimentBreakdown: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topIssues: {
    issue: string;
    frequency: string;
    description: string;
  }[];
  featureRequests: {
    feature: string;
    priority: string;
    description: string;
  }[];
  criticalBugs: {
    bug: string;
    severity: string;
    description: string;
  }[];
  recommendedActions: {
    action: string;
    priority: string;
    impactedMetric: string;
  }[];
}

interface AiInsightsProps {
  filters: FeedbackFilter;
}

export function AiInsights({ filters }: AiInsightsProps) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [lastGenerated, setLastGenerated] = useState<Date | null>(null);

  const handleGenerateValues = async () => {
    setLoading(true);
    try {
      const data = await generateAIInsights(filters);
      setInsights(data);
      setLastGenerated(new Date());
      toast.success("Insights generated successfully!");
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("No feedback found")) {
        toast.error("Not enough feedback to analyze.");
      } else {
        toast.error("Failed to generate insights. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    const p = priority.toLowerCase();
    if (p === 'high' || p === 'critical') return "bg-red-500 hover:bg-red-600";
    if (p === 'medium') return "bg-yellow-500 hover:bg-yellow-600";
    return "bg-blue-500 hover:bg-blue-600";
  };

  if (!insights && !loading) {
    return (
      <Card className="border border-border bg-card">
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5 text-muted-foreground" />
              Intelligence Report
            </h3>
            <p className="text-sm text-muted-foreground">
              Compile current feedback data into actionable analytics and trends.
            </p>
          </div>
          <Button onClick={handleGenerateValues} size="lg" variant="secondary">
            Generate Report
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border border-border">
        <CardContent className="py-12 flex flex-col items-center justify-center space-y-4">
          <Loader2 className="h-6 w-6 text-muted-foreground animate-spin" />
          <div className="text-center space-y-1">
            <h3 className="font-medium text-sm">Processing Data</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto">
              Compiling insights report...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden bg-card print:bg-white print:text-black">
      <CardHeader className="border-b border-border pb-4 bg-muted/10 print:bg-transparent print:border-b-2 print:border-black">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-foreground print:text-black">
              <BarChart className="h-5 w-5 text-muted-foreground print:text-black" />
              Executive Intelligence Report
            </CardTitle>
            <CardDescription className="print:text-slate-600">
              Analysis based on current feedback filters • {lastGenerated?.toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" size="sm" onClick={() => window.print()}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={handleGenerateValues}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Regenerate
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8 print:p-0 print:pt-6">
        {/* Executive Summary */}
        {insights?.executiveSummary && (
          <div className="bg-[#0a0a0a]/30 rounded-lg p-4 border border-[#27272a] print:border-none print:p-0 print:bg-transparent">
            <h4 className="font-medium text-sm text-foreground mb-2 print:text-black">Executive Summary</h4>
            <p className="text-sm text-slate-300 leading-relaxed print:text-slate-800">
              {insights.executiveSummary}
            </p>
          </div>
        )}

        {/* Sentiment Analysis */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-foreground print:text-black">Sentiment Distribution</h4>
          <div className="flex w-full h-3 rounded-full overflow-hidden bg-muted print:bg-slate-200">
            <div 
              style={{ width: `${insights?.sentimentBreakdown.positive}%` }} 
              className="bg-emerald-500 transition-all duration-500 print:bg-emerald-600" 
              title={`Positive: ${insights?.sentimentBreakdown.positive}%`}
            />
            <div 
              style={{ width: `${insights?.sentimentBreakdown.neutral}%` }} 
              className="bg-slate-400 transition-all duration-500 print:bg-slate-500" 
              title={`Neutral: ${insights?.sentimentBreakdown.neutral}%`}
            />
            <div 
              style={{ width: `${insights?.sentimentBreakdown.negative}%` }} 
              className="bg-rose-500 transition-all duration-500 print:bg-rose-600" 
              title={`Negative: ${insights?.sentimentBreakdown.negative}%`}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground print:text-black font-medium">
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-500 print:bg-emerald-600"/> Positive • {insights?.sentimentBreakdown.positive}%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-400 print:bg-slate-500"/> Neutral • {insights?.sentimentBreakdown.neutral}%</span>
            <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 print:bg-rose-600"/> Negative • {insights?.sentimentBreakdown.negative}%</span>
          </div>
        </div>

        <Separator className="print:bg-black/20" />

        <div className="grid md:grid-cols-2 gap-8">
            {/* Top Issues */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground">Emerging Issues</h4>
                <div className="space-y-3">
                    {insights?.topIssues.map((issue, i) => (
                        <div key={i} className="group relative pl-4 border-l-2 border-muted hover:border-foreground transition-colors py-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-foreground print:text-black">{issue.issue}</span>
                                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-sm print:text-black print:border print:border-black/20">{issue.frequency} Impact</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed print:text-slate-800">{issue.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Requests */}
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-foreground print:text-black">Top Requested Features</h4>
                 <div className="space-y-3">
                    {insights?.featureRequests.map((req, i) => (
                        <div key={i} className="group relative pl-4 border-l-2 border-muted hover:border-foreground transition-colors py-1 print:border-slate-300">
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-sm text-foreground print:text-black">{req.feature}</span>
                            </div>
                            <p className="text-sm text-muted-foreground leading-relaxed print:text-slate-800">{req.description}</p>
                            <div className="w-full bg-muted/50 rounded-full h-1.5 mt-2">
                               <div 
                                className={`h-1.5 rounded-full ${req.priority.toLowerCase() === 'high' ? 'bg-foreground' : req.priority.toLowerCase() === 'medium' ? 'bg-muted-foreground' : 'bg-muted-foreground/50'}`} 
                                style={{ width: req.priority.toLowerCase() === 'high' ? '100%' : req.priority.toLowerCase() === 'medium' ? '60%' : '30%' }}
                               />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        {insights?.criticalBugs && insights.criticalBugs.length > 0 && (
            <>
            <Separator className="print:bg-black/20" />
            <div className="space-y-4">
                <h4 className="font-medium text-sm text-rose-500 flex items-center gap-2">
                    Critical System Failures
                </h4>
                <div className="space-y-3">
                    {insights.criticalBugs.map((bug, i) => (
                        <div key={i} className="flex flex-col gap-1 p-3 bg-rose-500/5 border border-rose-500/20 rounded-md print:border-rose-300 print:bg-white">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm text-foreground print:text-black">{bug.bug}</span>
                                <span className="text-[10px] font-semibold tracking-wider text-rose-500 uppercase print:text-rose-700">{bug.severity}</span>
                            </div>
                            <p className="text-sm text-muted-foreground print:text-slate-800">{bug.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            </>
        )}

        <Separator className="print:bg-black/20" />

        {/* Recommended Actions */}
        <div className="space-y-4 flex flex-col pt-2">
           <h4 className="font-medium text-sm text-foreground print:text-black">
                Suggested Actions
            </h4>
            <div className="overflow-x-auto">
               <table className="w-full text-sm text-left print:border print:border-collapse">
                  <thead className="text-xs text-muted-foreground bg-muted/50 print:bg-transparent print:border-b print:border-black/20 print:text-black print:font-bold">
                     <tr>
                        <th className="px-4 py-2 font-medium rounded-tl-md print:border print:border-black/20">Action Items</th>
                        <th className="px-4 py-2 font-medium print:border print:border-black/20">Impact Area</th>
                        <th className="px-4 py-2 font-medium rounded-tr-md print:border print:border-black/20">Priority</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-border print:divide-black/20">
                    {insights?.recommendedActions.map((action, i) => (
                        <tr key={i} className="hover:bg-muted/10 transition-colors print:border-b print:border-black/20">
                            <td className="px-4 py-3 font-medium text-foreground print:text-black print:border-r print:border-black/20">{action.action}</td>
                            <td className="px-4 py-3 text-muted-foreground print:text-slate-800 print:border-r print:border-black/20">{action.impactedMetric}</td>
                            <td className="px-4 py-3">
                               <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                                    action.priority.toLowerCase() === 'high' ? 'bg-foreground text-background print:bg-black print:text-white print:px-2' : 
                                    action.priority.toLowerCase() === 'medium' ? 'bg-muted text-foreground print:bg-white print:text-black print:border print:border-black' : 
                                    'bg-transparent border border-muted text-muted-foreground print:text-black print:border-black/30'
                               }`}>
                                 {action.priority}
                               </span>
                            </td>
                        </tr>
                    ))}
                  </tbody>
               </table>
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
