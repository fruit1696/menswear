import React from "react";
import Hero from "@/components/sections/Hero";
import BrandIntro from "@/components/sections/BrandIntro";
import Quality from "@/components/sections/Quality";
import SelectedCollection from "@/components/sections/SelectedCollection";
import PickYourStyle from "@/components/sections/PickYourStyle";
import VisitStore from "@/components/sections/VisitStore";
import WantMore from "@/components/sections/WantMore";
import WhyAffordable from "@/components/sections/WhyAffordable";
import TwoPieceConcept from "@/components/sections/TwoPieceConcept";
import WhyBuy from "@/components/sections/WhyBuy";
import HowItWorks from "@/components/sections/HowItWorks";
import Trust from "@/components/sections/Trust";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
    React.useEffect(() => {
        document.title = "Raymond Shirt Fabric Online | Crazy Cut Piece";
        let canonicalLink = document.querySelector("link[rel='canonical']");
        if (canonicalLink) {
            canonicalLink.setAttribute("href", "https://menswear-cbbg.vercel.app/");
        }
    }, []);

    return (
        <>
            <Hero />
            <SelectedCollection />
            <PickYourStyle />
            <TwoPieceConcept />
            <WhyBuy />
            {/* <BrandIntro /> */}
            {/* <Quality /> */}
            <VisitStore />
            <WantMore />
            {/* <WhyAffordable /> */}
            {/* <HowItWorks /> */}
            {/* <Trust /> */}
            <FinalCTA />
        </>
    );
}