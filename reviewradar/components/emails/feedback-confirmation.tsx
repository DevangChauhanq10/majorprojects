
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

interface FeedbackConfirmationProps {
  userFirstname?: string;
  feedbackTitle?: string;
  feedbackCategory?: string;
}

export default function FeedbackConfirmation({
  userFirstname = "User",
  feedbackTitle = "Feedback",
  feedbackCategory = "General",
}: FeedbackConfirmationProps) {
  return (
    <Html>
      <Head />
      <Preview>We received your feedback: {feedbackTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>Thanks for your feedback{userFirstname ? `, ${userFirstname}` : ""}!</Heading>
          <Text style={text}>
            We've received your submission titled "{feedbackTitle}" regarding {feedbackCategory}.
          </Text>
          <Text style={text}>
            Our team will review it shortly. We appreciate your contribution to making ReviewRadar even better.
          </Text>
          <Section style={btnContainer}>
            <Link style={button} href="http://localhost:3000/dashboard/user">
              View Your Feedback
            </Link>
          </Section>
          <Text style={footer}>
            ReviewRadar Team
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#ffffff",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  margin: "0 auto",
  padding: "20px 0 48px",
  maxWidth: "560px",
};

const h1 = {
  fontSize: "24px",
  fontWeight: "bold",
  margin: "40px 0",
  padding: "0",
  lineHeight: "1.4",
  color: "#333",
};

const text = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#333",
  marginBottom: "20px",
};

const btnContainer = {
  textAlign: "center" as const,
  marginTop: "32px",
  marginBottom: "32px",
};

const button = {
  backgroundColor: "#000000",
  borderRadius: "3px",
  color: "#fff",
  fontSize: "16px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "12px",
};

const footer = {
  color: "#8898aa",
  fontSize: "12px",
  marginTop: "40px",
};
