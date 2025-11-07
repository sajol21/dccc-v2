import React from 'react';
import { motion } from 'framer-motion';

const storySections = [
    {
        title: 'The Origin and Vision',
        text: 'Dhaka College Cultural Club (DCCC) is the first and only cultural organization of Dhaka College run by students of classes XI-XII. With the motto "Know thyself; Express yourself," the club began its journey on 7 July 2021, initiated by the HSC 22 batch after college activities resumed post-pandemic. Recognizing the students\' passion for culture, the college authority approved its formation, and Professor Sharifa Sultana was appointed as the convenor. The club was established to nurture cultural practice and give students a platform to express their creativity.',
        imageUrl: 'https://picsum.photos/800/600?random=11',
        layout: 'text-image'
    },
    {
        title: 'Structure and Departments',
        text: 'After its founding, applications were opened for students interested in leadership. Qualified students became executive members, each assigned to specific departments — administration, management, IT, sponsorship, and marketing. Later, deputy executive members were added to support the operations. To involve students in diverse forms of art, DCCC introduced seven departments: Vocal, Dance, Drama, Comedy, Recitation, Literature, and Art.',
        imageUrl: 'https://picsum.photos/800/600?random=12',
        layout: 'image-text'
    },
    {
        title: 'Early Recognition',
        text: 'To showcase young talent, DCCC launched its first online event, "DCCC Weekly Contest 2021," where participants from top colleges like Notre Dame, Rajuk Uttara, and Adamjee Cantt Public College took part. This event established the club\'s name beyond Dhaka College. Soon, DCCC began collaborating as a club partner in various inter-college fests. In September 2021, the Academia Team was formed to help members balance their studies alongside cultural activities.',
        imageUrl: 'https://picsum.photos/800/600?random=13',
        layout: 'text-image'
    },
    {
        title: 'Growth and Progress',
        text: 'A new chapter began in March 2022 with the arrival of the HSC 23 batch, giving fresh momentum to the club\'s activities. DCCC started organizing offline sessions and workshops to train newcomers and regularly published members\' music, art, and literature on its digital platforms. The first offline event, "Summer Art Camp 2022," held in collaboration with six reputed college clubs, marked a turning point for DCCC\'s recognition in Dhaka\'s cultural scene. To strengthen its foundation, 23 associate executive members were appointed in September 2022, ensuring continuity and leadership for future activities.',
        imageUrl: 'https://picsum.photos/800/600?random=14',
        layout: 'image-text'
    }
];

const StorySection: React.FC<{ section: typeof storySections[0] }> = ({ section }) => {
    const TextView = () => (
        <motion.div
            initial={{ opacity: 0, x: section.layout === 'text-image' ? -50 : 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
        >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{section.title}</h2>
            <p className="text-gray-700 leading-relaxed">{section.text}</p>
        </motion.div>
    );

    const ImageView = () => (
         <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
         >
            <img src={section.imageUrl} alt={section.title} className="rounded-lg shadow-lg w-full h-auto object-cover aspect-[4/3]" />
        </motion.div>
    );

    return (
        <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
            {section.layout === 'text-image' ? (
                <>
                    <TextView />
                    <ImageView />
                </>
            ) : (
                <>
                    <ImageView />
                    <TextView />
                </>
            )}
        </div>
    );
}

const AboutPage: React.FC = () => {
    return (
        <div className="bg-white text-gray-800">
            {/* Hero Section */}
            <header className="pt-32 pb-16 md:pt-40 md:pb-24 bg-white">
                <div className="container mx-auto px-4 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7 }}
                        className="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900"
                    >
                        Our Story
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.7, delay: 0.2 }}
                        className="mt-4 text-lg md:text-xl text-gray-600 max-w-3xl mx-auto"
                    >
                        Inspiring Creativity and Expression
                    </motion.p>
                </div>
            </header>

            <main className="py-16 md:py-24">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-28">
                    {storySections.map((section, index) => (
                        <StorySection key={index} section={section} />
                    ))}
                </div>
            </main>
        </div>
    );
};

export default AboutPage;
