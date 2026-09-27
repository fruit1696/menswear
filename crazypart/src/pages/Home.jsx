import React from "react";
import Hero from "@/components/sections/Hero";
import SelectedCollection from "@/components/sections/SelectedCollection";
import VisitStore from "@/components/sections/VisitStore";
import TwoPieceConcept from "@/components/sections/TwoPieceConcept";
import WhyBuy from "@/components/sections/WhyBuy";
import FinalCTA from "@/components/sections/FinalCTA";
import PickYourStyle from "@/components/sections/PickYourStyle";

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
            <TwoPieceConcept />
            <WhyBuy />
            <PickYourStyle />
            {/* <BrandIntro /> */}
            {/* <Quality /> */}
            <VisitStore />
            {/* <WantMore /> */}
            {/* <WhyAffordable /> */}
            {/* <HowItWorks /> */}
            {/* <Trust /> */}
            <FinalCTA />
        </>
    );
}
