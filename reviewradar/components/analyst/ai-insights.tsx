"use client";

import { useState } from "react";
import { generateAIInsights } from "@/app/actions/generate-insights";
import { FeedbackFilter } from "@/app/actions/analyst";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Brain, Lightbulb, Loader2, AlertTriangle, RefreshCcw, Download, CheckCircle2, BarChart } from "lucide-react";
import { toast } from "sonner";

interface InsightsData {
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
    mentions: number;
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
              <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              AI Insights Generator
            </h3>
            <p className="text-sm text-muted-foreground">
              Analyze current feedback filters to discover trends, issues, and actionable recommendations.
            </p>
          </div>
          <Button onClick={handleGenerateValues} size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Brain className="mr-2 h-4 w-4" />
            Generate Insights
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="border-indigo-100 dark:border-indigo-900">
        <CardContent className="py-12 flex flex-col items-center justify-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping" />
            <div className="bg-indigo-100 dark:bg-indigo-900/50 p-4 rounded-full relative">
              <Loader2 className="h-8 w-8 text-indigo-600 dark:text-indigo-400 animate-spin" />
            </div>
          </div>
          <div className="text-center space-y-1">
            <h3 className="font-semibold text-lg">Analyzing Feedback...</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Our AI is crunching the numbers, identifying patterns, and extracting meaningful insights.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-border shadow-sm overflow-hidden bg-card">
      <CardHeader className="border-b border-border pb-4 bg-muted/20">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl text-foreground">
              <Lightbulb className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              AI-Generated Insights
            </CardTitle>
            <CardDescription>
              Analysis based on your current filters • Generated on {lastGenerated?.toLocaleTimeString()}
            </CardDescription>
          </div>
          <div className="flex gap-2">
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
      
      <CardContent className="p-6 space-y-8">
        {/* Sentiment Analysis */}
        <div className="space-y-4">
          <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">Sentiment Breakdown</h4>
          <div className="space-y-3">
             <div className="space-y-1">
               <div className="flex justify-between text-sm">
                 <span className="text-green-600 font-medium">Positive</span>
                 <span className="font-bold">{insights?.sentimentBreakdown.positive}%</span>
               </div>
               <Progress value={insights?.sentimentBreakdown.positive} className="h-2 bg-green-100 dark:bg-green-950/30 [&>div]:bg-green-500" />
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-sm">
                 <span className="text-yellow-600 font-medium">Neutral</span>
                 <span className="font-bold">{insights?.sentimentBreakdown.neutral}%</span>
               </div>
               <Progress value={insights?.sentimentBreakdown.neutral} className="h-2 bg-yellow-100 dark:bg-yellow-950/30 [&>div]:bg-yellow-500" />
             </div>
             <div className="space-y-1">
               <div className="flex justify-between text-sm">
                 <span className="text-red-600 font-medium">Negative</span>
                 <span className="font-bold">{insights?.sentimentBreakdown.negative}%</span>
               </div>
               <Progress value={insights?.sentimentBreakdown.negative} className="h-2 bg-red-100 dark:bg-red-950/30 [&>div]:bg-red-500" />
             </div>
          </div>
        </div>

        <Separator />

        <div className="grid md:grid-cols-2 gap-8">
            {/* Top Issues */}
            <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-orange-500" /> Top Issues
                </h4>
                <div className="space-y-3">
                    {insights?.topIssues.map((issue, i) => (
                        <div key={i} className="flex gap-3 items-start bg-card p-3 rounded-lg border border-border border-l-2 border-l-orange-500 shadow-sm">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-950/30 text-xs font-bold text-orange-600 dark:text-orange-400">
                                {i + 1}
                            </span>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-foreground">{issue.issue}</span>
                                    <Badge variant="secondary" className="text-xs">{issue.frequency}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{issue.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Requests */}
            <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-blue-500" /> Top Requests
                </h4>
                 <div className="space-y-3">
                    {insights?.featureRequests.map((req, i) => (
                        <div key={i} className="flex gap-3 items-start bg-card p-3 rounded-lg border border-border border-l-2 border-l-blue-500 shadow-sm">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-950/30 text-xs font-bold text-blue-600 dark:text-blue-400">
                                {i + 1}
                            </span>
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-foreground">{req.feature}</span>
                                    <Badge className={`${getPriorityColor(req.priority)} text-white`}>{req.priority}</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{req.mentions} mentions</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
        
        {insights?.criticalBugs && insights.criticalBugs.length > 0 && (
            <>
            {/* Added check for non-empty array before rendering this section */}
            <div className="space-y-4">
                <Separator />
                <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-500" /> Critical Attention Needed
                </h4>
                <div className="space-y-3">
                    {insights.criticalBugs.map((bug, i) => (
                        <div key={i} className="flex gap-3 items-start bg-card p-3 rounded-lg border border-border border-l-2 border-l-red-500 shadow-sm">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-950/30 text-xs font-bold text-red-600 dark:text-red-400">
                                {i + 1}
                            </span>
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-foreground">{bug.bug}</span>
                                    <Badge variant="destructive" className="text-[10px] h-5 px-1.5 uppercase">{bug.severity}</Badge>
                                </div>
                                <p className="text-sm text-muted-foreground leading-relaxed">{bug.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            </>
        )}

        <Separator />

        {/* Recommended Actions */}
        <div className="space-y-4">
           <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Recommended Actions
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
                {insights?.recommendedActions.map((action, i) => (
                    <Card key={i} className="bg-card shadow-sm border-border border-t-2 border-t-emerald-500">
                        <CardContent className="p-4 flex flex-col h-full justify-between">
                            <div className="mb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="border-border text-foreground">
                                        {action.priority} Priority
                                    </Badge>
                                    <span className="text-xs font-medium text-muted-foreground">
                                        Impact: {action.impactedMetric}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-foreground leading-relaxed mt-3">
                                    {action.action}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>

      </CardContent>
    </Card>
  );
}
