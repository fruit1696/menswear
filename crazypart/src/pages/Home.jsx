import React from "react";
import Hero from "@/components/sections/Hero";
import BrandIntro from "@/components/sections/BrandIntro";
import Quality from "@/components/sections/Quality";
import SelectedCollection from "@/components/sections/SelectedCollection";
import PickYourStyle from "@/components/sections/PickYourStyle";
import WantMore from "@/components/sections/WantMore";
import WhyAffordable from "@/components/sections/WhyAffordable";
import TwoPieceConcept from "@/components/sections/TwoPieceConcept";
import WhyBuy from "@/components/sections/WhyBuy";
import HowItWorks from "@/components/sections/HowItWorks";
import Trust from "@/components/sections/Trust";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
    return (
        <>
            <Hero />
            <SelectedCollection />
            <PickYourStyle />
            <TwoPieceConcept />
            <WhyBuy />
            {/* <BrandIntro /> */}
            {/* <Quality /> */}
            <WantMore />
            {/* <WhyAffordable /> */}
            {/* <HowItWorks /> */}
            {/* <Trust /> */}
            <FinalCTA />
        </>
    );
}