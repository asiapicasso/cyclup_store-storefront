import { Envelope } from "@medusajs/icons";
import { Button } from "@medusajs/ui";

const Service = () => {
    return (
        <div className="p-12 max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold mb-12 text-center">Nos Services</h1>
            <div className="mb-14">
                <h2 className="text-2xl font-semibold mb-6">Décoration</h2>
                <p className="text-lg leading-relaxed">
                    Nous offrons des services de décoration intérieure pour transformer votre espace en un lieu élégant et confortable. Que vous cherchiez à moderniser votre maison ou à créer une ambiance unique, notre équipe de décorateurs professionnels est là pour vous aider.
                </p>
            </div>
            <div className="mb-14">
                <h2 className="text-2xl font-semibold mb-6">Achat et Expertise</h2>
                <p className="text-lg leading-relaxed">
                    Nous proposons des services d&apos;achat et d&apos;expertise pour divers objets de valeur. Que vous souhaitiez vendre des antiquités, des œuvres d&apos;art ou des objets de collection, nos experts sont prêts à évaluer vos articles et à vous offrir le meilleur prix.
                </p>
            </div>
            <div className="mb-14">
                <h2 className="text-2xl font-semibold mb-6">Vide Maison / Appartement et Rachat du Contenu</h2>
                <p className="text-lg leading-relaxed">
                    Nous offrons un service complet de vide maison et appartement, incluant le rachat du contenu. Que vous déménagiez ou que vous ayez besoin de désencombrer votre espace, nous nous occupons de tout, de l&apos;évaluation à l&apos;achat des articles que vous souhaitez vendre.
                </p>
            </div>
            <div className="justify-center items-center text-center">
                <a
                    href="mailto:malek@cyclupdesign.ch"
                    target="_blank"
                >
                    <Button variant="secondary">
                        Ecrivez-nous par mail
                        <Envelope />
                    </Button>
                </a>
            </div>
        </div>



    )
}

export default Service;
