import React from 'react';
import { Body, Container, Head, Heading, Html, Preview, Section, Text, Link } from '@react-email/components';
import { Tailwind } from '@react-email/tailwind';

interface InviteEmailProps {
  inviterName: string;
  invitedName: string;
  wineryName: string;
  ctaLink: string;
}

export default function InviteEmail({ inviterName = "Gabi Zimmer", invitedName = "Juan", wineryName = "Casa Grande", ctaLink = "https://gabitasting.com" }: InviteEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Invitación a Gabi Tasting</Preview>
      <Tailwind>
        <Body className="bg-white font-sans">
          <Container className="mx-auto py-20 px-4">
            <Section className="border border-solid border-gray-200 rounded-lg p-8 shadow-sm">
              <div className="text-center mb-4">
                {/* Ícono de copa de vino */}
                <svg
                  className="mx-auto h-12 w-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#35472a"
                  strokeWidth="2"
                >
                  <path d="M12 20v-7m0 0c3.5-1 5-4 5-7H7c0 3 1.5 6 5 7zM7 6h10M12 20h5a1 1 0 001-1v-1H6v1a1 1 0 001 1h5z" />
                </svg>
              </div>
              <Heading className="text-center text-2xl mb-4 text-[#35472a]">
                BIENVENIDO A GABI TASTING
              </Heading>
              <Text className="text-center text-gray-700 mb-4">
                Hola {invitedName},
              </Text>
              <Text className="text-center text-gray-700 mb-8">
                {inviterName} te invita a unirte a Gabi Tasting, una plataforma desarrollada para simplificar el registro y la gestión de vinos e información en catas de puntuación. Como representante de {wineryName}, tendrás acceso para inscribir y administrar los vinos de la bodega.
              </Text>
              <Section className="text-center mb-8">
                <Link
                  href={ctaLink}
                  className="bg-[#35472a] text-white px-6 py-3 rounded-md font-medium inline-block hover:bg-[#425936] transition-colors"
                >
                  Acceder a Gabi Tasting
                </Link>
              </Section>
              <Text className="text-sm text-gray-500 text-center">
                Si tienes alguna pregunta, no dudes en contactarnos en{' '}
                <Link
                  href="mailto:tasting@gabizimmer.com"
                  className="text-[#35472a] underline"
                >
                  tasting@gabizimmer.com
                </Link>
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
} 