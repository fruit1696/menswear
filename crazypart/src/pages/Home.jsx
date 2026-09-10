import React from "react";
import Hero from "@/components/sections/Hero";
import SelectedCollection from "@/components/sections/SelectedCollection";
import PickYourStyle from "@/components/sections/PickYourStyle";
import VisitStore from "@/components/sections/VisitStore";
import WantMore from "@/components/sections/WantMore";
import TwoPieceConcept from "@/components/sections/TwoPieceConcept";
import WhyBuy from "@/components/sections/WhyBuy";
import FinalCTA from "@/components/sections/FinalCTA";

export default function Home() {
    React.useEffect(() => {
        document.title = "Raymond Shirt Fabric Online | Crazy Cutpiece";
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
