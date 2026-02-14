
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface CriticalAlertProps {
  recentFeedbackCount: number;
}

export default function CriticalAlert({
  recentFeedbackCount = 3,
}: CriticalAlertProps) {
  return (
    <Html>
      <Head />
      <Preview>⚠️ Critical Alert: Variable Negative Feedback Detected</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Negative Feedback Spike Detected</Heading>
          <Text style={text}>
            ReviewRadar has detected a spike in negative feedback.
          </Text>
          <Section style={alertBox}>
            <Text style={alertText}>
              <strong>{recentFeedbackCount}</strong> critical ratings (1-2 stars) received in the last 24 hours.
            </Text>
          </Section>
          <Text style={text}>
            Immediate action may be required. Please review the dashboard for details on the specific issues reported.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href="http://localhost:3000/dashboard/admin">
              Investigate Now
            </Link>
          </Section>
          <Text style={footer}>
            ReviewRadar Monitoring System
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#fef2f2", 
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  maxWidth: "600px",
  borderRadius: "5px",
  boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)",
  borderTop: "4px solid #ef4444",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  lineHeight: "1.4",
  color: "#b91c1c", 
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
  marginBottom: "20px",
  padding: "0 40px",
};

const alertBox = {
  backgroundColor: "#fee2e2",
  padding: "20px",
  margin: "0 40px 20px",
  borderRadius: "4px",
  border: "1px solid #fca5a5",
};

const alertText = {
  margin: "0",
  color: "#991b1b",
  fontSize: "16px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
  padding: "0 40px",
};

const button = {
  backgroundColor: "#dc2626", 
  borderRadius: "5px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px 20px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "20px",
  padding: "0 40px",
  textAlign: "center" as const,
};
