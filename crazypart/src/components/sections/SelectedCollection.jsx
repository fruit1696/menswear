import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import Image from "@/components/ui/image";
import { FEATURED_COLLECTION_LIST } from "@/lib/featuredCollections";
import SectionHeading from "@/components/SectionHeading";

export default function SelectedCollection() {
    return (
        <section id="fabrics" className="py-12 sm:py-16 bg-[#F9F8F6]">
            <div className="mx-auto max-w-7xl px-5 sm:px-8">
                <SectionHeading
                    eyebrow="COLLECTION"
                    title="Browse by Color"
                    align="center"
                />

                <div className="mt-10 sm:mt-12 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 lg:gap-16 max-w-4xl mx-auto items-start">
                    {FEATURED_COLLECTION_LIST.map((collection) => (
                        <section
                            key={collection.id}
                            aria-labelledby={`${collection.id}-collection-title`}
                            className="w-full flex flex-col items-center text-center"
                        >
                            <div className="mb-4 flex flex-col items-center gap-1 text-center">
                                <h3
                                    id={`${collection.id}-collection-title`}
                                    className="font-display text-2xl font-medium text-foreground sm:text-3xl"
                                >
                                    {collection.name}
                                </h3>
                                <span className="text-xs text-foreground/50">
                                    {collection.varieties.length} varieties
                                </span>
                            </div>
                            <Link
                                to={`/collections/${collection.id}`}
                                className="group block w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-md"
                                aria-label={`Browse ${collection.name}`}
                            >
                                <div className="relative overflow-hidden rounded-xl">
                                    <Image
                                        src={collection.image}
                                        alt={`${collection.name} preview`}
                                        className="aspect-[3/4] w-full object-cover object-[center_10%] transition-transform duration-500 group-hover:scale-[1.02]"
                                    />
                                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-4 py-2 text-xs font-semibold text-foreground shadow-sm backdrop-blur-sm">
                                        View Collection<ArrowRight className="h-3.5 w-3.5" />
                                    </span>
                                </div>
                            </Link>
                        </section>
                    ))}
                </div>

                <div className="mt-12 sm:mt-16 flex justify-center">
                    <Link
                        to="/collections/all"
                        className="inline-flex items-center justify-center gap-2 rounded-sm bg-foreground px-7 py-4 text-sm font-medium tracking-wide text-primary-foreground transition-colors duration-300 hover:bg-foreground/90"
                    >
                        Shop the Full Collection<ArrowRight className="h-4 w-4" />
                    </Link>
                </div>
            </div>
        </section>
    );
}

