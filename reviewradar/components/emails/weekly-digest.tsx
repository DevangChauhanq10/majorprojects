
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
  Row,
  Column,
} from "@react-email/components";
import * as React from "react";

interface WeeklyDigestProps {
  totalFeedback: number;
  topCategory: string;
  averageRating: string; // Formatted as string for display
}

export default function WeeklyDigest({
  totalFeedback = 0,
  topCategory = "None",
  averageRating = "0.0",
}: WeeklyDigestProps) {
  return (
    <Html>
      <Head />
      <Preview>Your Weekly ReviewRadar Summary is here!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Weekly ReviewRadar Summary</Heading>
          <Text style={text}>
            Here's a quick look at how feedback has been trending this week.
          </Text>

          <Section style={statsContainer}>
            <Row>
              <Column style={statColumn}>
                <Text style={statLabel}>Total Feedback</Text>
                <Text style={statValue}>{totalFeedback}</Text>
              </Column>
              <Column style={statColumn}>
                <Text style={statLabel}>Top Category</Text>
                <Text style={statValue}>{topCategory}</Text>
              </Column>
              <Column style={statColumn}>
                <Text style={statLabel}>Avg Rating</Text>
                <Text style={statValue}>{averageRating}</Text>
              </Column>
            </Row>
          </Section>

          <Section style={btnContainer}>
            <Link style={button} href="http://localhost:3000/dashboard/analyst">
              View Dashboard
            </Link>
          </Section>
          <Text style={footer}>
            ReviewRadar Analytics Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
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
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0 40px",
  lineHeight: "1.4",
  color: "#333",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
  marginBottom: "20px",
  padding: "0 40px",
};

const statsContainer = {
  padding: "20px 40px",
  backgroundColor: "#f9fafb", 
  borderRadius: "4px",
  width: "100%",
};

const statColumn = {
  textAlign: "center" as const,
  width: "33%",
};

const statLabel = {
  color: "#6b7280",
  fontSize: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px",
  marginBottom: "4px",
};

const statValue = {
  color: "#111827",
  fontSize: "24px",
  fontWeight: "bold",
  margin: "0",
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
  padding: "0 40px",
};

const button = {
  backgroundColor: "#4f46e5", 
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
