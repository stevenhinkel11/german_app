export interface TriviaFact {
  id: string;
  title: string;
  fact: string;
  country: 'Germany' | 'Austria' | 'Switzerland';
  category: 'culture' | 'history' | 'food' | 'language' | 'geography' | 'traditions' | 'quirky' | 'modern';
  difficulty: number;
  funRating: number;
  source?: string;
  year?: number;
}

export const triviaDatabase: TriviaFact[] = [
  // German Facts
  {
    id: '1',
    title: 'Christmas Market Tradition',
    fact: 'Germany has over 2,500 Christmas markets. The oldest one in Dresden dates back to 1434! These markets sell Glühwein (mulled wine), Lebkuchen (gingerbread), and handcrafted ornaments.',
    country: 'Germany',
    category: 'traditions',
    difficulty: 2,
    funRating: 5,
    year: 1434
  },
  {
    id: '2',
    title: 'Bread Paradise',
    fact: 'Germany has over 3,000 different types of bread! German bread culture is so significant that UNESCO added it to their Intangible Cultural Heritage list in 2014.',
    country: 'Germany',
    category: 'food',
    difficulty: 2,
    funRating: 4,
    year: 2014
  },
  {
    id: '3',
    title: 'Autobahn Freedom',
    fact: 'About 70% of Germany\'s autobahn has no speed limit! There\'s a recommended speed of 130 km/h, but you can legally drive faster on unrestricted sections.',
    country: 'Germany',
    category: 'culture',
    difficulty: 2,
    funRating: 5
  },
  {
    id: '4',
    title: 'Recycling Champions',
    fact: 'Germans recycle 68% of their waste - one of the highest rates globally. The recycling system is so detailed that mixing waste types can result in fines!',
    country: 'Germany',
    category: 'modern',
    difficulty: 2,
    funRating: 3
  },
  {
    id: '5',
    title: 'Kindergarten Invention',
    fact: 'The concept of "Kindergarten" (children\'s garden) was invented in Germany by Friedrich Fröbel in 1840. The idea was revolutionary: learning through play and creativity.',
    country: 'Germany',
    category: 'history',
    difficulty: 3,
    funRating: 4,
    year: 1840
  },
  {
    id: '6',
    title: 'Beer Purity Law',
    fact: 'Germany\'s Reinheitsgebot (Beer Purity Law) from 1516 is the world\'s oldest food law still in use. It states beer can only contain water, hops, malt, and yeast.',
    country: 'Germany',
    category: 'food',
    difficulty: 3,
    funRating: 4,
    year: 1516
  },
  {
    id: '7',
    title: 'Castle Country',
    fact: 'Germany has over 20,000 castles! That\'s more than any other country. Many were built during medieval times when Germany was divided into hundreds of small kingdoms.',
    country: 'Germany',
    category: 'history',
    difficulty: 2,
    funRating: 5
  },
  {
    id: '8',
    title: 'Longest Word Championship',
    fact: 'German is famous for compound words. The longest official word was "Rindfleischetikettierungsüberwachungsaufgabenübertragungsgesetz" (63 letters) - a law about beef labeling!',
    country: 'Germany',
    category: 'language',
    difficulty: 4,
    funRating: 5
  },
  {
    id: '9',
    title: 'Oktoberfest Reality',
    fact: 'Munich\'s Oktoberfest actually starts in September! It begins in mid-September and ends in early October. Over 6 million people attend annually.',
    country: 'Germany',
    category: 'traditions',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '10',
    title: 'Forest Nation',
    fact: 'One-third of Germany is covered by forests! Germans have a special relationship with forests, expressed in the word "Waldeinsamkeit" (forest solitude).',
    country: 'Germany',
    category: 'geography',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '11',
    title: 'Currywurst Creation',
    fact: 'Currywurst was invented in Berlin in 1949 by Herta Heuwer. She mixed curry powder with tomato sauce and served it on sausage. Now Germans eat 800 million servings yearly!',
    country: 'Germany',
    category: 'food',
    difficulty: 3,
    funRating: 4,
    year: 1949
  },
  {
    id: '12',
    title: 'Sunday Shopping Ban',
    fact: 'Most German stores are closed on Sundays by law. This "Sonntagsruhe" (Sunday rest) protects workers\' right to rest and maintains traditional family time.',
    country: 'Germany',
    category: 'culture',
    difficulty: 2,
    funRating: 3
  },
  {
    id: '13',
    title: 'Gummy Bear Birthplace',
    fact: 'Gummy bears were invented in Germany in 1922 by Hans Riegel, founder of Haribo. The original name was "Gummibärchen" (little gummy bears).',
    country: 'Germany',
    category: 'food',
    difficulty: 2,
    funRating: 4,
    year: 1922
  },
  {
    id: '14',
    title: 'East-West Differences',
    fact: 'You can still see differences between former East and West Germany today - from traffic light designs (Ampelmännchen) to preferred cola brands!',
    country: 'Germany',
    category: 'history',
    difficulty: 3,
    funRating: 4
  },
  {
    id: '15',
    title: 'Asparagus Obsession',
    fact: 'Germans are obsessed with white asparagus ("Spargel"). During asparagus season (April-June), restaurants have special Spargel menus and there are asparagus festivals!',
    country: 'Germany',
    category: 'food',
    difficulty: 2,
    funRating: 3
  },

  // Austrian Facts
  {
    id: '16',
    title: 'Sound of Music Reality',
    fact: 'While "The Sound of Music" is beloved worldwide, most Austrians haven\'t seen it! Many find the portrayal stereotypical and historically inaccurate.',
    country: 'Austria',
    category: 'culture',
    difficulty: 3,
    funRating: 4
  },
  {
    id: '17',
    title: 'Coffeehouse Culture',
    fact: 'Viennese coffeehouse culture is UNESCO Intangible Cultural Heritage. Traditional coffeehouses serve 30+ coffee types and it\'s rude to rush customers who spend hours reading.',
    country: 'Austria',
    category: 'culture',
    difficulty: 3,
    funRating: 4
  },
  {
    id: '18',
    title: 'Mozart\'s Birthplace',
    fact: 'Wolfgang Amadeus Mozart was born in Salzburg in 1756. His birthplace is now a museum, and the city hosts the world-famous Salzburg Festival annually.',
    country: 'Austria',
    category: 'history',
    difficulty: 2,
    funRating: 4,
    year: 1756
  },
  {
    id: '19',
    title: 'Sachertorte Secret',
    fact: 'The original Sachertorte recipe is a closely guarded secret. Only the Hotel Sacher in Vienna knows the authentic recipe, leading to a famous legal battle over the "real" Sachertorte.',
    country: 'Austria',
    category: 'food',
    difficulty: 3,
    funRating: 4
  },
  {
    id: '20',
    title: 'Alpine Nation',
    fact: 'About 62% of Austria is mountainous! The country has over 400 peaks above 3,000 meters, making it a paradise for skiers and mountaineers.',
    country: 'Austria',
    category: 'geography',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '21',
    title: 'Waltz Origins',
    fact: 'The waltz originated in Austria in the late 18th century. Initially, it was considered scandalous because couples danced so closely together!',
    country: 'Austria',
    category: 'culture',
    difficulty: 3,
    funRating: 4
  },
  {
    id: '22',
    title: 'Red Bull Wings',
    fact: 'Red Bull was invented in Austria in 1987, inspired by a Thai energy drink. The company now owns multiple sports teams and organizes extreme sports events worldwide.',
    country: 'Austria',
    category: 'modern',
    difficulty: 2,
    funRating: 4,
    year: 1987
  },
  {
    id: '23',
    title: 'Crystal Headquarters',
    fact: 'Swarovski crystal has been made in Austria since 1895. The company\'s headquarters in Wattens features a crystal-covered giant head that serves as the entrance.',
    country: 'Austria',
    category: 'culture',
    difficulty: 3,
    funRating: 3,
    year: 1895
  },
  {
    id: '24',
    title: 'Freud\'s Vienna',
    fact: 'Sigmund Freud lived and worked in Vienna for most of his life. His former home is now a museum showcasing the birthplace of psychoanalysis.',
    country: 'Austria',
    category: 'history',
    difficulty: 3,
    funRating: 3
  },
  {
    id: '25',
    title: 'Landlocked Nation',
    fact: 'Austria is completely landlocked but has a strong naval tradition! The Austrian Navy existed until 1918 and operated on the Adriatic Sea when Austria controlled coastal regions.',
    country: 'Austria',
    category: 'history',
    difficulty: 4,
    funRating: 4
  },

  // Swiss Facts
  {
    id: '26',
    title: 'Swiss Cheese Holes',
    fact: 'The holes in Swiss cheese (called "eyes") are created by bacteria that produce CO2 during aging. Swiss cheesemakers can judge cheese quality by tapping it and listening to the sound!',
    country: 'Switzerland',
    category: 'food',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '27',
    title: 'Punctual Trains',
    fact: 'Swiss trains have an average delay of just 3 minutes! If a train is more than 3 minutes late, passengers can get partial refunds from the world\'s most efficient railway system.',
    country: 'Switzerland',
    category: 'culture',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '28',
    title: 'Direct Democracy',
    fact: 'Switzerland practices direct democracy where citizens vote on specific issues 3-4 times yearly. Swiss people have voted on everything from minimum wage to nuclear power.',
    country: 'Switzerland',
    category: 'culture',
    difficulty: 4,
    funRating: 4
  },
  {
    id: '29',
    title: 'Multilingual Nation',
    fact: 'Switzerland has four official languages: German (63%), French (23%), Italian (8%), and Romansh (0.5%). Swiss German is so different from standard German that even Germans struggle to understand it!',
    country: 'Switzerland',
    category: 'language',
    difficulty: 3,
    funRating: 4
  },
  {
    id: '30',
    title: 'Bunker Nation',
    fact: 'Switzerland has enough nuclear bunkers to shelter its entire population! These bunkers are maintained by law and many double as wine cellars or storage spaces during peacetime.',
    country: 'Switzerland',
    category: 'quirky',
    difficulty: 3,
    funRating: 5
  },
  {
    id: '31',
    title: 'Chocolate Excellence',
    fact: 'Swiss people eat about 20kg of chocolate per person annually - more than anyone else! Swiss chocolate innovation includes milk chocolate (invented in 1875) and conching.',
    country: 'Switzerland',
    category: 'food',
    difficulty: 2,
    funRating: 5,
    year: 1875
  },
  {
    id: '32',
    title: 'Military Service Tradition',
    fact: 'Swiss men must complete military service and many keep their service rifles at home! Switzerland has one of the highest gun ownership rates but very low gun crime.',
    country: 'Switzerland',
    category: 'culture',
    difficulty: 3,
    funRating: 3
  },
  {
    id: '33',
    title: 'Banking Secrecy',
    fact: 'Swiss banking secrecy laws date back to 1934, but they\'ve been relaxed recently due to international pressure. Swiss banks now share information with foreign tax authorities.',
    country: 'Switzerland',
    category: 'modern',
    difficulty: 4,
    funRating: 3,
    year: 1934
  },
  {
    id: '34',
    title: 'Alps Coverage',
    fact: 'The Alps cover 65% of Switzerland! The country has 48 peaks over 4,000 meters high, including the famous Matterhorn and Jungfraujoch.',
    country: 'Switzerland',
    category: 'geography',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '35',
    title: 'Expensive Living',
    fact: 'Switzerland consistently ranks as one of the world\'s most expensive countries. A simple lunch can cost $25-30, but salaries are proportionally higher.',
    country: 'Switzerland',
    category: 'modern',
    difficulty: 2,
    funRating: 3
  },

  // More German Facts
  {
    id: '36',
    title: 'Football World Champions',
    fact: 'Germany has won the FIFA World Cup 4 times (1954, 1974, 1990, 2014) and hosted it twice. The 2014 victory in Brazil was particularly emotional after penalties in previous tournaments.',
    country: 'Germany',
    category: 'culture',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '37',
    title: 'Pretzel Origins',
    fact: 'Pretzels (Brezeln) originated in Germany and have religious significance - their twisted shape represents arms folded in prayer. Bavaria produces millions daily!',
    country: 'Germany',
    category: 'food',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '38',
    title: 'Berlin Wall Legacy',
    fact: 'The Berlin Wall stood for 28 years (1961-1989). Today, you can follow its former path with a marked trail through Berlin, and some sections remain as memorials.',
    country: 'Germany',
    category: 'history',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '39',
    title: 'Christmas Tree Tradition',
    fact: 'The Christmas tree tradition started in Germany in the 16th century. Prince Albert brought it to Britain in 1840, and German immigrants spread it to America.',
    country: 'Germany',
    category: 'traditions',
    difficulty: 2,
    funRating: 4,
    year: 1540
  },
  {
    id: '40',
    title: 'University Excellence',
    fact: 'Germany has some of the world\'s oldest universities. Heidelberg University (1386) is Germany\'s oldest, and many German universities offer free tuition even to international students!',
    country: 'Germany',
    category: 'modern',
    difficulty: 3,
    funRating: 3,
    year: 1386
  },

  // Additional variety facts
  {
    id: '41',
    title: 'Cuckoo Clock Origins',
    fact: 'Contrary to popular belief, cuckoo clocks originated in Germany\'s Black Forest region, not Switzerland! The tradition dates back to the 1730s.',
    country: 'Germany',
    category: 'culture',
    difficulty: 3,
    funRating: 4,
    year: 1730
  },
  {
    id: '42',
    title: 'Austrian Croissant',
    fact: 'The croissant was actually invented in Austria, not France! It was created in Vienna in 1683 to celebrate victory over the Ottoman Empire.',
    country: 'Austria',
    category: 'food',
    difficulty: 3,
    funRating: 4,
    year: 1683
  },
  {
    id: '43',
    title: 'Swiss Army Knife',
    fact: 'The Swiss Army Knife was created in 1891 for the Swiss Army. The original had just four tools: blade, reamer, can opener, and screwdriver.',
    country: 'Switzerland',
    category: 'culture',
    difficulty: 2,
    funRating: 4,
    year: 1891
  },
  {
    id: '44',
    title: 'German Work-Life Balance',
    fact: 'Germans value work-life balance highly. They have extensive vacation time (20-30 days), and calling colleagues after work hours is generally frowned upon.',
    country: 'Germany',
    category: 'modern',
    difficulty: 2,
    funRating: 3
  },
  {
    id: '45',
    title: 'Vienna\'s Musical Heritage',
    fact: 'Vienna was home to Mozart, Beethoven, Schubert, and Strauss. The city hosts over 15,000 concerts annually and has more than 100 museums.',
    country: 'Austria',
    category: 'culture',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '46',
    title: 'Swiss Precision',
    fact: 'Switzerland produces 95% of the world\'s luxury watches. Swiss watchmaking precision is legendary - some watches are accurate to within seconds per year.',
    country: 'Switzerland',
    category: 'culture',
    difficulty: 2,
    funRating: 4
  },
  {
    id: '47',
    title: 'Döner Kebab Birth',
    fact: 'Döner kebab was popularized in Germany by Turkish immigrants in the 1970s. Berlin alone has over 1,000 döner shops, and Germans eat 550 million döners yearly!',
    country: 'Germany',
    category: 'food',
    difficulty: 2,
    funRating: 4,
    year: 1970
  },
  {
    id: '48',
    title: 'Alpine Yodeling',
    fact: 'Yodeling originated in the Swiss Alps as a way for shepherds to communicate across mountain valleys. Each region developed its own distinct yodeling style.',
    country: 'Switzerland',
    category: 'traditions',
    difficulty: 3,
    funRating: 4
  },
  {
    id: '49',
    title: 'Vienna\'s Underground',
    fact: 'Vienna has an extensive underground system including subways, sewers, and catacombs. The famous Vienna sewers were featured in "The Third Man" movie.',
    country: 'Austria',
    category: 'quirky',
    difficulty: 3,
    funRating: 3
  },
  {
    id: '50',
    title: 'German Car Excellence',
    fact: 'Germany is home to luxury car brands BMW, Mercedes-Benz, Audi, and Porsche. The country produces about 6 million vehicles annually and is famous for automotive engineering.',
    country: 'Germany',
    category: 'modern',
    difficulty: 1,
    funRating: 4
  }
]; 