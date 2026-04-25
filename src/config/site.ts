export const siteConfig = {
    branding: {
        name: "Lúdicamente Didácticos",
        shortName: "Lúdicamente Didácticos",
        tagline: "Aprender jugando, crecer creando",
        logo: "https://res.cloudinary.com/mern-project-fabi/image/upload/v1776957453/assets-ludicamente/logos-home.png",
    },

    seo: {
        title: "Lúdicamente Didácticos — Aprender jugando, crecer creando",
        description:
            "Kits y productos didácticos con enfoque psicopedagógico. Desarrollo sensorial, aprendizaje significativo e inclusión para niños.",
        url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
        keywords: [
            "didáctico",
            "psicopedagogía",
            "juego educativo",
            "kits didácticos",
            "montessori",
            "desarrollo infantil",
            "aprendizaje",
        ],
        openGraph: {
            title: "Lúdicamente Didácticos",
            description:
                "Kits y productos didácticos con enfoque psicopedagógico.",
            images: ["/og-image.jpg"],
        },
    },

    contact: {
        phone: "+54 9 11 0000-0000",
        email: "hola@ludicamente.com",
        instagram: "https://instagram.com/ludicamente.didacticos",
        whatsapp: "+5491100000000",
        location: "Buenos Aires, Argentina",
    },

    payment: {
        transferencia: {
            cbu: "0000003100079163271327",
            titular: "Victoria Zoppi",
            banco: "MERCADOPAGO",
            alias: "LUDICAMENTE.CH",
        },
    },
    navigation: {
        main: [
            { label: "Home", href: "/" },
            { label: "Productos", href: "/shop?type=producto" },
            { label: "Kits", href: "/shop?type=kit" },
        ],
        dropdown: {
            label: "Más de Lúdicamente",
            items: [
                { label: "Sobre Lúdicamente", href: "/sobre-nosotros" },
                { label: "Recursos didácticos", href: "/recursos" },
                { label: "Insights", href: "/insights" },
            ],
        },
    },

    hero: {
        fallbackSlide: {
            punchline:
                "El juego como puente entre conocimiento, emoción y vínculo",
            ctaText: "Ver catálogo",
            ctaHref: "/shop",
        },
    },

    sections: {
        featured: {
            badge: "Destacados",
            title: "Nuestros kits más queridos",
            subtitle: "Seleccionados por su impacto en el desarrollo infantil",
        },
        shop: {
            badge: "Catálogo",
            title: "Explorá nuestros productos",
        },
        pillars: [
            {
                title: "Desarrollo sensorial",
                description:
                    "Materiales cuidadosamente seleccionados que estimulan los sentidos y favorecen la exploración activa.",
                icon: "sparkles",
                color: "bg-ldc-verde/20",
            },
            {
                title: "Aprendizaje significativo",
                description:
                    "Cada juego está diseñado para conectar el conocimiento con la experiencia vivencial del niño.",
                icon: "brain",
                color: "bg-ldc-amarillo/20",
            },
            {
                title: "Inclusión y adaptabilidad",
                description:
                    "Propuestas pensadas para acompañar distintos ritmos y estilos de aprendizaje.",
                icon: "heart",
                color: "bg-ldc-rosa/20",
            },
        ],
    },

    footer: {
        columns: [
            {
                title: "Contacto",
                items: [
                    {
                        label: "ludicamentedidacticos@gmail.com",
                        href: "mailto:ludicamentedidacticos@gmail.com",
                    },
                    // 2346 - 508914
                    { label: "+54 9 2346 508914", href: "tel:+5492346508914" },
                    { label: "Buenos Aires, Argentina", href: "#" },
                ],
            },
            {
                title: "Seguinos",
                items: [
                    {
                        label: "Instagram",
                        href: "https://instagram.com/ludicamente.didacticos",
                    },
                    { label: "WhatsApp", href: "https://wa.me/5492346508914" },
                ],
            },
            {
                title: "Soluciones",
                items: [
                    { label: "Kits didácticos", href: "/shop?type=kit" },
                    { label: "Productos", href: "/shop?type=producto" },
                    { label: "Sobre nosotros", href: "/sobre-nosotros" },
                    { label: "Insights", href: "/insights" },
                ],
            },
        ],
        legal: "© 2026 Lúdicamente Didácticos. Todos los derechos reservados.",
    },

    owner: {
        name: "Lúdicamente Didácticos",
        role: "Licenciada en Psicopedagogía",
        description: [
            "¡Hola! Soy Victoria Zoppi, Licenciada en Psicopedagogía.",
            "Me desempeño en el ámbito educativo, acompañando las trayectorias escolares de niños y niñas desde una mirada integral, respetuosa y personalizada. Próximamente también ampliaré mi trabajo al ámbito clínico, sumando nuevos espacios de acompañamiento profesional.",
            "Actualmente me encuentro realizando una especialización en Intervención y Estimulación Temprana, con el objetivo de seguir incorporando herramientas actualizadas para potenciar el desarrollo infantil desde los primeros años.",
            "Además, soy creadora de Lúdicamente, un proyecto nacido en noviembre de 2025 dedicado a ofrecer recursos, juegos y materiales didácticos pensados para consultorios, familias y escuelas. Mi propósito es acercar propuestas creativas y significativas que favorezcan el aprendizaje a través del juego.",
        ],
    },
} as const;

export type SiteConfig = typeof siteConfig;
