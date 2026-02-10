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
import { Brain, Sparkles, Loader2, AlertTriangle, RefreshCcw, Download, CheckCircle2 } from "lucide-react";
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
      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border-indigo-100 dark:border-indigo-900">
        <CardContent className="flex items-center justify-between p-6">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
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
    <Card className="border-indigo-100 dark:border-indigo-900 shadow-sm overflow-hidden">
      <CardHeader className="bg-indigo-50/50 dark:bg-indigo-950/20 border-b border-indigo-100 dark:border-indigo-900 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center gap-2 text-xl text-indigo-950 dark:text-indigo-50">
              <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
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
                <h4 className="font-semibold text-sm uppercase tracking-wider text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Top Issues
                </h4>
                <div className="space-y-3">
                    {insights?.topIssues.map((issue, i) => (
                        <div key={i} className="flex gap-3 items-start bg-red-50 dark:bg-red-950/10 p-3 rounded-lg border border-red-100 dark:border-red-900/30">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-red-100 text-xs font-bold text-red-600 dark:bg-red-900 dark:text-red-300">
                                {i + 1}
                            </span>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-red-900 dark:text-red-200">{issue.issue}</span>
                                    <Badge variant="secondary" className="text-xs bg-red-200 text-red-800 hover:bg-red-200">{issue.frequency}</Badge>
                                </div>
                                <p className="text-sm text-red-700 dark:text-red-400/80 leading-relaxed">{issue.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Feature Requests */}
            <div className="space-y-4">
                <h4 className="font-semibold text-sm uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-2">
                    <Sparkles className="h-4 w-4" /> Top Requests
                </h4>
                 <div className="space-y-3">
                    {insights?.featureRequests.map((req, i) => (
                        <div key={i} className="flex gap-3 items-start bg-blue-50 dark:bg-blue-950/10 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                {i + 1}
                            </span>
                            <div className="w-full">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-medium text-blue-900 dark:text-blue-200">{req.feature}</span>
                                    <Badge className={`${getPriorityColor(req.priority)} text-white`}>{req.priority}</Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-blue-700 dark:text-blue-400/80">
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
                <h4 className="font-semibold text-sm uppercase tracking-wider text-destructive flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Critical Attention Needed
                </h4>
                <div className="grid gap-3">
                    {insights.criticalBugs.map((bug, i) => (
                        <Alert key={i} variant="destructive" className="bg-red-50 border-red-200 dark:bg-red-950/20 dark:border-red-900">
                            <AlertTriangle className="h-4 w-4" />
                            <AlertTitle className="flex items-center gap-2">
                                {bug.bug}
                                <Badge variant="destructive" className="text-[10px] h-5 px-1.5 uppercase">{bug.severity}</Badge>
                            </AlertTitle>
                            <AlertDescription>
                                {bug.description}
                            </AlertDescription>
                        </Alert>
                    ))}
                </div>
            </div>
            </>
        )}

        <Separator />

        {/* Recommended Actions */}
        <div className="space-y-4">
           <h4 className="font-semibold text-sm uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4" /> Recommended Actions
            </h4>
            <div className="grid sm:grid-cols-2 gap-4">
                {insights?.recommendedActions.map((action, i) => (
                    <Card key={i} className="border-emerald-100 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/10 shadow-none">
                        <CardContent className="p-4 flex flex-col h-full justify-between">
                            <div className="mb-2">
                                <div className="flex justify-between items-start mb-2">
                                    <Badge variant="outline" className="border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-400">
                                        {action.priority} Priority
                                    </Badge>
                                    <span className="text-xs font-medium text-emerald-600 dark:text-emerald-500">
                                        Impact: {action.impactedMetric}
                                    </span>
                                </div>
                                <p className="text-sm font-medium text-emerald-950 dark:text-emerald-50 leading-relaxed">
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
