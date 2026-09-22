import React from "react";
import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import FabricCard from "@/components/FabricCard";
import SectionHeading from "@/components/SectionHeading";
import { FEATURED_COLLECTIONS } from "@/lib/featuredCollections";

export default function FeaturedCollection() {
    const { collectionId } = useParams();
    const collection = FEATURED_COLLECTIONS[collectionId];

    React.useEffect(() => {
        if (collection) document.title = `${collection.name} | Crazy Cutpiece`;
    }, [collection]);

    if (!collection) {
        return <main className="min-h-[70vh] px-5 pb-20 pt-36 text-center sm:px-8">
            <h1 className="font-display text-4xl text-foreground">Collection not found</h1>
            <Link to="/#fabrics" className="mt-6 inline-block border-b border-accent pb-1 text-sm font-medium">Back to Top Picks</Link>
        </main>;
    }

    return <main className="min-h-screen bg-[#F9F8F6] px-5 pb-20 pt-32 sm:px-8 sm:pt-36">
        <div className="mx-auto max-w-7xl">
            <Link to="/#fabrics" className="inline-flex items-center gap-2 text-sm font-medium text-foreground/65 transition-colors hover:text-foreground">
                <ArrowLeft className="h-4 w-4" />Back to Top Picks
            </Link>
            <div className="mt-10 text-center">
                <SectionHeading eyebrow="CURATED FABRICS" title={collection.name.toUpperCase()} align="center" />
                <p className="mx-auto mt-5 max-w-2xl text-sm leading-relaxed text-foreground/65 sm:text-base">{collection.description}</p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
                {collection.varieties.map((fabric) => <FabricCard key={fabric.id} fabric={fabric} customerPick staticCard />)}
            </div>
        </div>
    </main>;
}

