import React, { JSX } from 'react';
import Layout from '@theme/Layout';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Hero from '../components/Hero';
import WorkExperience from "../components/WorkExperience";
import SideProjects from "../components/SideProjects";
import Services from "../components/Services";
import Portfolio from "../components/Portfolio";
import {LogoLoopComponent} from "../components/LogoLoop";
import FactorySection from "../components/FactorySection";

export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Full Stack Developer Portfolio"
    >
      <main className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <Hero />
        <LogoLoopComponent />
        <FactorySection />
        <WorkExperience />
        <Services />
        <Portfolio />
        <SideProjects />
      </main>
    </Layout>
  );
}
