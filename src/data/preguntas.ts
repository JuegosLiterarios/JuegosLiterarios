import { Pregunta } from "@/types/game";

export const preguntas: Pregunta[] = [
  // === CLÁSICOS ESPAÑOLES ===
  {
    id: 1,
    parrafo: "En un lugar de la Mancha, de cuyo nombre no quiero acordarme, no ha mucho tiempo que vivía un hidalgo de los de lanza en astillero, adarga antigua, rocín flaco y galgo corredor.",
    opciones: ["Don Quijote de la Mancha", "El Lazarillo de Tormes", "La Celestina", "El Conde Lucanor"],
    respuestaCorrecta: 0,
    dificultad: "facil",
    autor: "Miguel de Cervantes",
    ano: 1605,
    genero: "Clásico español",
    idioma: "Español",
    pais: "España"
  },
  {
    id: 2,
    parrafo: "Yo, señor, no soy malo, aunque no me faltarían ocasiones para serlo. Nací en el río Tormes, por cuya causa me pusieron el sobrenombre; y de padre no sé otra cosa sino que se llamaba Antón Pérez.",
    opciones: ["La Celestina", "El Lazarillo de Tormes", "El Buscón", "La vida es sueño"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Anónimo",
    ano: 1554,
    genero: "Clásico español",
    idioma: "Español",
    pais: "España"
  },
  {
    id: 3,
    parrafo: "¡Ay, honor! ¡Ay, dicha! ¡Ay, ventura! ¡Ay, que me muero! ¡Ay, que me deshago! ¡Ay, que me desmayo! ¡Ay, que me ahorco! ¡Ay, que me ahogo! ¡Ay, que me quemo! ¡Ay, que me mato!",
    opciones: ["La Celestina", "El Quijote", "Fuenteovejuna", "La vida es sueño"],
    respuestaCorrecta: 0,
    dificultad: "dificil",
    autor: "Fernando de Rojas",
    ano: 1499,
    genero: "Clásico español",
    idioma: "Español",
    pais: "España"
  },
  {
    id: 4,
    parrafo: "Que pues el mundo es teatro, y todos los hombres actores, y Dios el director, el que hace bien su papel, bien le paga la fama, y el que mal, mal le paga la infamia.",
    opciones: ["El Buscón", "La vida es sueño", "El Alcalde de Zalamea", "El Burlador de Sevilla"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Pedro Calderón de la Barca",
    ano: 1635,
    genero: "Teatro clásico",
    idioma: "Español",
    pais: "España"
  },
  {
    id: 5,
    parrafo: "Pues, señor, como dice el refrán: 'más vale un toma que dos te daré'. Y así, yo me contento con lo que Dios me da, y no me quejo de mi suerte, que si me la dieron mala, yo la hago peor con mis desgracias.",
    opciones: ["El Buscón", "El Lazarillo de Tormes", "El Quijote", "La Celestina"],
    respuestaCorrecta: 0,
    dificultad: "dificil",
    autor: "Francisco de Quevedo",
    ano: 1626,
    genero: "Clásico español",
    idioma: "Español",
    pais: "España"
  },

  // === REALISMO MÁGICO / LATINOAMERICANO ===
  {
    id: 6,
    parrafo: "Muchos años después, frente al pelotón de fusilamiento, el coronel Aureliano Buendía había de recordar aquella tarde remota en que su padre lo llevó a conocer el hielo.",
    opciones: ["Pedro Páramo", "Cien años de soledad", "La casa de los espíritus", "Ficciones"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "Gabriel García Márquez",
    ano: 1967,
    genero: "Realismo mágico",
    idioma: "Español",
    pais: "Colombia"
  },
  {
    id: 7,
    parrafo: "Vine a Comala porque me dijeron que acá vivía mi padre, un tal Pedro Páramo. Mi madre me lo dijo. Y yo le prometí que vendría a verlo en cuanto ella muriera.",
    opciones: ["Cien años de soledad", "Pedro Páramo", "La muerte de Artemio Cruz", "Aura"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "Juan Rulfo",
    ano: 1955,
    genero: "Realismo mágico",
    idioma: "Español",
    pais: "México"
  },
  {
    id: 8,
    parrafo: "Encontré una ciudad que era como un libro abierto, una ciudad de páginas que se volteaban solas, de calles que eran versos y de plazas que eran estrofas.",
    opciones: ["Rayuela", "Ficciones", "El Aleph", "Terra Nostra"],
    respuestaCorrecta: 0,
    dificultad: "medio",
    autor: "Julio Cortázar",
    ano: 1963,
    genero: "Experimental",
    idioma: "Español",
    pais: "Argentina"
  },
  {
    id: 9,
    parrafo: "El universo (que otros llaman la Biblioteca) se compone de un número indefinido, y tal vez infinito, de galerías hexagonales, con vastos pozos de ventilación en el medio, cercados por barandas bajísimas.",
    opciones: ["El Aleph", "La biblioteca de Babel", "Ficciones", "Tlön, Uqbar, Orbis Tertius"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Jorge Luis Borges",
    ano: 1941,
    genero: "Ficción filosófica",
    idioma: "Español",
    pais: "Argentina"
  },
  {
    id: 10,
    parrafo: "El Aleph era de dos o tres centímetros de diámetro, pero la superficie cósmica estaba en él, sin disminución de tamaño. Eran (son) las cosas infinitas, todas las cosas, todas las cosas del universo.",
    opciones: ["La biblioteca de Babel", "El Aleph", "Ficciones", "El libro de arena"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Jorge Luis Borges",
    ano: 1945,
    genero: "Ficción filosófica",
    idioma: "Español",
    pais: "Argentina"
  },
  {
    id: 11,
    parrafo: "Barba azul era un hombre muy rico, pero tenía una barba azul que le daba un aspecto tan espantoso que no había mujer ni niña que no huyera de terror al verlo.",
    opciones: ["Cuentos de Perrault", "Cuentos de Grimm", "Las mil y una noches", "Fábulas de Esopo"],
    respuestaCorrecta: 0,
    dificultad: "facil",
    autor: "Charles Perrault",
    ano: 1697,
    genero: "Cuento clásico",
    idioma: "Francés",
    pais: "Francia"
  },

  // === CLÁSICOS UNIVERSALES ===
  {
    id: 12,
    parrafo: "Era un día luminoso y frío de abril y los relojes daban las trece. Winston Smith, con la barbilla clavada en el pecho en su esfuerzo por eludir el viento cortante, se deslizó rápidamente por entre las puertas de cristal de las Casas del Ministerio de la Verdad.",
    opciones: ["Un mundo feliz", "1984", "Fahrenheit 451", "Rebelión en la granja"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "George Orwell",
    ano: 1949,
    genero: "Distopía",
    idioma: "Inglés",
    pais: "Reino Unido"
  },
  {
    id: 13,
    parrafo: "Era un placer especial quemar. Ver cómo desaparecían las cosas, ver cómo se consumían, cambiaban de color, se transformaban en cenizas. Era una satisfacción especial, un placer que le llenaba de alegría.",
    opciones: ["1984", "Un mundo feliz", "Fahrenheit 451", "La naranja mecánica"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    autor: "Ray Bradbury",
    ano: 1953,
    genero: "Distopía",
    idioma: "Inglés",
    pais: "Estados Unidos"
  },
  {
    id: 14,
    parrafo: "Al principio de julio, en pleno verano, una vez ya muy tarde, un joven salió de la pequeña habitación que alquilaba en la calle S., subió a la calle y se dirigió, como si tuviera prisa, hacia el puente de la K.",
    opciones: ["El proceso", "La metamorfosis", "Crimen y castigo", "Los hermanos Karamázov"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    autor: "Fiódor Dostoyevski",
    ano: 1866,
    genero: "Novela psicológica",
    idioma: "Ruso",
    pais: "Rusia"
  },
  {
    id: 15,
    parrafo: "Una mañana, tras un sueño intranquilo, Gregorio Samsa se despertó convertido en un monstruoso insecto. Estaba echado de espaldas sobre un duro caparazón y, al alzar la cabeza, vio su vientre convexo y oscuro.",
    opciones: ["El proceso", "La metamorfosis", "El castillo", "Amerika"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "Franz Kafka",
    ano: 1915,
    genero: "Ficción absurda",
    idioma: "Alemán",
    pais: "República Checa"
  },
  {
    id: 16,
    parrafo: "El estudio estaba lleno del aroma de las rosas, y cuando la luz de la tarde de verano entraba por la ventana abierta, se veía que el polvo flotaba en el aire como partículas de oro.",
    opciones: ["El retrato de Dorian Gray", "Drácula", "El extraño caso del Dr. Jekyll y Mr. Hyde", "La vuelta del mundo en 80 días"],
    respuestaCorrecta: 0,
    dificultad: "medio",
    autor: "Oscar Wilde",
    ano: 1890,
    genero: "Gótico",
    idioma: "Inglés",
    pais: "Irlanda"
  },
  {
    id: 17,
    parrafo: "Cuando yo tenía seis años vi en un libro sobre la selva virgen que se titulaba 'Historias vividas', una magnífica lámina que representaba una serpiente boa que se tragaba a una fiera.",
    opciones: ["Alicia en el país de las maravillas", "El Principito", "Peter Pan", "El mago de Oz"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "Antoine de Saint-Exupéry",
    ano: 1943,
    genero: "Fábula filosófica",
    idioma: "Francés",
    pais: "Francia"
  },
  {
    id: 18,
    parrafo: "En el principio, cuando Dios creó los cielos y la tierra, la tierra era un caos sin forma y vacía, y las tinieblas cubrían la faz del abismo, y el Espíritu de Dios se movía sobre la faz de las aguas.",
    opciones: ["El nombre de la rosa", "La Divina Comedia", "El Paraíso perdido", "Génesis"],
    respuestaCorrecta: 0,
    dificultad: "medio",
    autor: "Umberto Eco",
    ano: 1980,
    genero: "Misterio histórico",
    idioma: "Italiano",
    pais: "Italia"
  },
  {
    id: 19,
    parrafo: "En medio del camino de nuestra vida, me encontré en una selva oscura, porque la vía recta estaba perdida. ¡Ah, cuán difícil es decir lo que era aquella selva, áspera y espesa, tan amarga que la muerte apenas es más!",
    opciones: ["La Eneida", "La Ilíada", "La Divina Comedia", "Las mil y una noches"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    autor: "Dante Alighieri",
    ano: 1320,
    genero: "Épica",
    idioma: "Italiano",
    pais: "Italia"
  },
  {
    id: 20,
    parrafo: "Cantaré a Aquiles, el Pelida, cuya cólera funesta causó innumerables males a los aqueos, y precipitó al Hades a muchas valientes almas de héroes, a quienes hizo presa de perros y pasto de aves.",
    opciones: ["La Eneida", "La Ilíada", "La Odisea", "Edipo Rey"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Homero",
    ano: -800,
    genero: "Épica",
    idioma: "Griego",
    pais: "Grecia"
  },

  // === LITERATURA MODERNA ===
  {
    id: 21,
    parrafo: "La casa tenía algo de extraño. No era solo su tamaño, ni su arquitectura, ni su ubicación en el borde del acantilado. Era algo más sutil, algo que se percibía en el aire, en la forma en que la luz se filtraba por las ventanas.",
    opciones: ["La casa de los espíritus", "La casa de Bernarda Alba", "Rebeca", "El castillo"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    autor: "Daphne du Maurier",
    ano: 1938,
    genero: "Gótico",
    idioma: "Inglés",
    pais: "Reino Unido"
  },
  {
    id: 22,
    parrafo: "La señora Dalloway dijo que compraría las flores ella misma. Pues Lucy tenía mucho trabajo. Con las puertas quitadas de las bisagras, Rumpelmayer y sus hombres estaban llegando.",
    opciones: ["Al faro", "La señora Dalloway", "Orlando", "Una habitación propia"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Virginia Woolf",
    ano: 1925,
    genero: "Modernismo",
    idioma: "Inglés",
    pais: "Reino Unido"
  },
  {
    id: 23,
    parrafo: "Todos los animales son iguales, pero algunos animales son más iguales que otros. Los cerdos se habían instalado en la granja y ahora miraban a los demás animales desde la ventana de la casa.",
    opciones: ["1984", "Un mundo feliz", "Rebelión en la granja", "Fahrenheit 451"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    autor: "George Orwell",
    ano: 1945,
    genero: "Sátira política",
    idioma: "Inglés",
    pais: "Reino Unido"
  },
  {
    id: 24,
    parrafo: "Lolita, luz de mi vida, fuego de mis entrañas. Pecado mío, alma mía. Lo-lee-ta: la punta de la lengua emprende un viaje de tres pasos por el paladar para golpear, a las tres, contra los dientes.",
    opciones: ["El gran Gatsby", "Lolita", "Catcher in the Rye", "El amante"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Vladimir Nabokov",
    ano: 1955,
    genero: "Novela contemporánea",
    idioma: "Inglés",
    pais: "Rusia/EE.UU."
  },
  {
    id: 25,
    parrafo: "En mi juventud fui un hombre más o menos como los demás. Me levantaba por la mañana, me lavaba la cara, me vestía y salía a la calle. Pero un día, sin saber por qué, empecé a sentir que algo no encajaba.",
    opciones: ["El hombre sin atributos", "La náusea", "El extranjero", "El proceso"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    autor: "Jean-Paul Sartre",
    ano: 1938,
    genero: "Existencialismo",
    idioma: "Francés",
    pais: "Francia"
  },

  // === LITERATURA CHILENA / HISPANOAMERICANA ===
  {
    id: 26,
    parrafo: "Estaba seguro de que ella era una mujer de carne y hueso, pero también estaba seguro de que era un sueño. Y en ese sueño, ella me miraba con ojos que no eran ojos, sino puertas abiertas a otro mundo.",
    opciones: ["La casa de los espíritus", "El obsceno pájaro de la noche", "Tres tristes tigres", "Rayuela"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    autor: "José Donoso",
    ano: 1970,
    genero: "Gótico latinoamericano",
    idioma: "Español",
    pais: "Chile"
  },
  {
    id: 27,
    parrafo: "El tercer residuo de la noche, cuando el insomnio se hace carne y se sienta a tu lado en la cama, es el momento en que los muertos regresan a contarte sus historias.",
    opciones: ["El llano en llamas", "Pedro Páramo", "Aura", "El túnel"],
    respuestaCorrecta: 2,
    dificultad: "dificil",
    autor: "Carlos Fuentes",
    ano: 1962,
    genero: "Realismo mágico",
    idioma: "Español",
    pais: "México"
  },
  {
    id: 28,
    parrafo: "La memoria es un extraño museo donde los objetos no están en orden cronológico, sino emocional. Un olor puede transportarte veinte años atrás, mientras que una fecha importante puede quedar sepultada bajo capas de olvido.",
    opciones: ["El amor en los tiempos del cólera", "Memoria de mis putas tristes", "Del amor y otros demonios", "Noticia de un secuestro"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Gabriel García Márquez",
    ano: 2004,
    genero: "Novela",
    idioma: "Español",
    pais: "Colombia"
  },
  {
    id: 29,
    parrafo: "El coronel no tenía quien le escribiera. Cada viernes, durante cincuenta y seis años, había esperado la carta que le anunciara la pensión de veteranos, y cada viernes la esperanza se desvanecía como el humo de los fogones.",
    opciones: ["Crónica de una muerte anunciada", "El coronel no tiene quien le escriba", "La mala hora", "El otoño del patriarca"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "Gabriel García Márquez",
    ano: 1961,
    genero: "Novela",
    idioma: "Español",
    pais: "Colombia"
  },
  {
    id: 30,
    parrafo: "El mundo se había vuelto un lugar donde los libros eran peligrosos, donde pensar era un acto subversivo, donde la imaginación era el último refugio de los que aún creían en la libertad.",
    opciones: ["Fahrenheit 451", "La biblioteca de Babel", "El nombre de la rosa", "El libro de arena"],
    respuestaCorrecta: 2,
    dificultad: "medio",
    autor: "Umberto Eco",
    ano: 1980,
    genero: "Misterio histórico",
    idioma: "Italiano",
    pais: "Italia"
  },

  // === LITERATURA INFANTIL / JUVENIL ===
  {
    id: 31,
    parrafo: "Alicia estaba empezando a aburrirse allí sentada en la orilla junto a su hermana, sin tener nada que hacer; una o dos veces había echado un vistazo al libro que leía su hermana, pero no tenía dibujos ni diálogos.",
    opciones: ["Peter Pan", "El Principito", "Alicia en el país de las maravillas", "El mago de Oz"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    autor: "Lewis Carroll",
    ano: 1865,
    genero: "Fantasía infantil",
    idioma: "Inglés",
    pais: "Reino Unido"
  },
  {
    id: 32,
    parrafo: "El señor y la señora Dursley, que vivían en el número 4 de Privet Drive, estaban orgullosos de decir que eran muy normales, afortunadamente. Eran las últimas personas que se esperaría encontrar relacionadas con algo extraño o misterioso.",
    opciones: ["El señor de los anillos", "Harry Potter y la piedra filosofal", "Las crónicas de Narnia", "Percy Jackson"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "J.K. Rowling",
    ano: 1997,
    genero: "Fantasía juvenil",
    idioma: "Inglés",
    pais: "Reino Unido"
  },
  {
    id: 33,
    parrafo: "En un agujero en el suelo, vivía un hobbit. No un agujero húmedo, sucio, repugnante, con restos de gusanos y olor a fango, ni tampoco un agujero seco, desnudo y arenoso, sin nada en qué sentarse ni qué comer.",
    opciones: ["El Hobbit", "El señor de los anillos", "Las crónicas de Narnia", "Eragon"],
    respuestaCorrecta: 0,
    dificultad: "facil",
    autor: "J.R.R. Tolkien",
    ano: 1937,
    genero: "Fantasía épica",
    idioma: "Inglés",
    pais: "Reino Unido"
  },
  {
    id: 34,
    parrafo: "Había una vez cuatro niños cuyos nombres eran Pedro, Susana, Edmundo y Lucía. Esta historia no es sobre algo que les ocurrió, sino sobre algo que les iba a ocurrir, cuando decidieron jugar a explorar la casa de campo.",
    opciones: ["El Hobbit", "Las crónicas de Narnia", "Harry Potter", "Peter Pan"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "C.S. Lewis",
    ano: 1950,
    genero: "Fantasía juvenil",
    idioma: "Inglés",
    pais: "Reino Unido"
  },
  {
    id: 35,
    parrafo: "Todas las familias felices se parecen unas a otras, pero cada familia infeliz lo es a su manera. Todo estaba revuelto en la casa de los Oblonski. La esposa había descubierto la infidelidad de su marido.",
    opciones: ["Crimen y castigo", "Guerra y paz", "Anna Karenina", "Los hermanos Karamázov"],
    respuestaCorrecta: 2,
    dificultad: "facil",
    autor: "León Tolstói",
    ano: 1877,
    genero: "Novela realista",
    idioma: "Ruso",
    pais: "Rusia"
  },

  // === DIFICULTAD DIFÍCIL ===
  {
    id: 36,
    parrafo: "riverrun, past Eve and Adam's, from swerve of shore to bend of bay, brings us by a commodius vicus of recirculation back to Howth Castle and Environs.",
    opciones: ["Ulysses", "Finnegans Wake", "Dublineses", "Retrato del artista adolescente"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    autor: "James Joyce",
    ano: 1939,
    genero: "Experimental",
    idioma: "Inglés",
    pais: "Irlanda"
  },
  {
    id: 37,
    parrafo: "El amor es una enfermedad que se cura con el matrimonio, como el hambre se cura con la comida. Pero a veces el remedio es peor que la enfermedad, y el matrimonio peor que el amor.",
    opciones: ["El periquillo sarniento", "El sí de las niñas", "La vida es sueño", "El burlador de Sevilla"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    autor: "Leandro Fernández de Moratín",
    ano: 1806,
    genero: "Teatro neoclásico",
    idioma: "Español",
    pais: "España"
  },
  {
    id: 38,
    parrafo: "El día en que lo iban a matar, Santiago Nasar se levantó a las 5:30 de la mañana para esperar el buque en que llegaba el obispo. Había soñado que estaba en una especie de alborada de plata.",
    opciones: ["Cien años de soledad", "Crónica de una muerte anunciada", "El otoño del patriarca", "La mala hora"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Gabriel García Márquez",
    ano: 1981,
    genero: "Novela",
    idioma: "Español",
    pais: "Colombia"
  },
  {
    id: 39,
    parrafo: "No hay ni un solo ser humano que sea capaz de comprender la vida. Ni siquiera los sabios, ni siquiera los santos. La vida es un misterio que se resuelve solo en la muerte, y la muerte es un misterio que se resuelve solo en la vida.",
    opciones: ["El túnel", "El extranjero", "La náusea", "El hombre sin atributos"],
    respuestaCorrecta: 0,
    dificultad: "dificil",
    autor: "Ernesto Sábato",
    ano: 1948,
    genero: "Novela psicológica",
    idioma: "Español",
    pais: "Argentina"
  },
  {
    id: 40,
    parrafo: "La infancia es el único estado en el que se es realmente libre. Después, la sociedad nos encadena con sus normas, sus expectativas, sus juicios. Pero en la infancia, antes de que el mundo nos corrompa, somos puros.",
    opciones: ["El Principito", "Emilio", "Pedro y el lobo", "Pinocho"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    autor: "Jean-Jacques Rousseau",
    ano: 1762,
    genero: "Filosofía/Educación",
    idioma: "Francés",
    pais: "Francia"
  },

  // === LITERATURA CONTEMPORÁNEA ===
  {
    id: 41,
    parrafo: "El amor en los tiempos del cólera era una enfermedad que se curaba con el tiempo, pero también una enfermedad que se curaba con el amor. Florentino Ariza la padeció durante cincuenta y un años, nueve meses y cuatro días.",
    opciones: ["Memoria de mis putas tristes", "El amor en los tiempos del cólera", "Del amor y otros demonios", "Doce cuentos peregrinos"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "Gabriel García Márquez",
    ano: 1985,
    genero: "Novela",
    idioma: "Español",
    pais: "Colombia"
  },
  {
    id: 42,
    parrafo: "El viejo y el mar eran viejos amigos. Habían pasado muchos días juntos, muchas noches, muchas tormentas. El viejo conocía cada ola, cada corriente, cada pez del mar.",
    opciones: ["Moby Dick", "El viejo y el mar", "La isla del tesoro", "Robinson Crusoe"],
    respuestaCorrecta: 1,
    dificultad: "facil",
    autor: "Ernest Hemingway",
    ano: 1952,
    genero: "Novela",
    idioma: "Inglés",
    pais: "Estados Unidos"
  },
  {
    id: 43,
    parrafo: "El gran Gatsby creía en la luz verde, el orgiástico futuro que año tras año se aleja ante nosotros. Elá nos escapaba entonces, pero eso no importa: mañana correremos más rápido, extenderemos los brazos más lejos.",
    opciones: ["El gran Gatsby", "Catcher in the Rye", "Matar a un ruiseñor", "Hacia la libertad"],
    respuestaCorrecta: 0,
    dificultad: "facil",
    autor: "F. Scott Fitzgerald",
    ano: 1925,
    genero: "Novela modernista",
    idioma: "Inglés",
    pais: "Estados Unidos"
  },
  {
    id: 44,
    parrafo: "Si realmente quieres oírlo, lo primero que probablemente quieras saber es dónde nací, y cómo fue mi infancia miserable, y qué hacían mis padres antes de tenerme, y todo ese rollo de David Copperfield.",
    opciones: ["El guardián entre el centeno", "El gran Gatsby", "Matar a un ruiseñor", "Hacia la libertad"],
    respuestaCorrecta: 0,
    dificultad: "facil",
    autor: "J.D. Salinger",
    ano: 1951,
    genero: "Novela juvenil",
    idioma: "Inglés",
    pais: "Estados Unidos"
  },
  {
    id: 45,
    parrafo: "Cuando tenía trece años, mi madre me llevó a ver a un hombre en la calle 124. Era un hombre ciego que tocaba el acordeón. Mi madre me dijo que era el mejor músico del mundo, y yo le creí.",
    opciones: ["Beloved", "La color púrpura", "Matar a un ruiseñor", "Hacia la libertad"],
    respuestaCorrecta: 1,
    dificultad: "medio",
    autor: "Alice Walker",
    ano: 1982,
    genero: "Novela epistolar",
    idioma: "Inglés",
    pais: "Estados Unidos"
  },

  // === MÁS DIFÍCILES ===
  {
    id: 46,
    parrafo: "La historia no es un relato de lo que sucedió, sino de lo que debería haber sucedido. Los historiadores no registran los hechos, sino los interpretan, y en esa interpretación se pierde la verdad.",
    opciones: ["El nombre de la rosa", "La historia de la locura", "Las palabras y las cosas", "Vigilar y castigar"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    autor: "Michel Foucault",
    ano: 1961,
    genero: "Filosofía",
    idioma: "Francés",
    pais: "Francia"
  },
  {
    id: 47,
    parrafo: "El ser humano está condenado a ser libre. Condenado, porque no se ha creado a sí mismo, y sin embargo, es libre, porque una vez arrojado al mundo, es responsable de todo lo que hace.",
    opciones: ["El ser y la nada", "El existencialismo es un humanismo", "La náusea", "El mito de Sísifo"],
    respuestaCorrecta: 1,
    dificultad: "dificil",
    autor: "Jean-Paul Sartre",
    ano: 1946,
    genero: "Filosofía",
    idioma: "Francés",
    pais: "Francia"
  },
  {
    id: 48,
    parrafo: "El mundo es un libro, y aquellos que no viajan leen solo una página. Pero hay páginas que no deberían ser leídas, y hay libros que no deberían ser abiertos, porque una vez que conoces el final, ya no puedes volver atrás.",
    opciones: ["El nombre de la rosa", "La biblioteca de Babel", "El libro de arena", "Foucault's Pendulum"],
    respuestaCorrecta: 2,
    dificultad: "dificil",
    autor: "Jorge Luis Borges",
    ano: 1975,
    genero: "Ficción filosófica",
    idioma: "Español",
    pais: "Argentina"
  },
  {
    id: 49,
    parrafo: "La escritura es una forma de magia. Cuando escribes, creas mundos que no existían antes. Pero la magia tiene un precio: cada palabra que escribes te quita algo de ti mismo, y cada historia que cuentas te cambia para siempre.",
    opciones: ["El nombre de la rosa", "La biblioteca de Babel", "El libro de arena", "La sombra del viento"],
    respuestaCorrecta: 3,
    dificultad: "medio",
    autor: "Carlos Ruiz Zafón",
    ano: 2001,
    genero: "Misterio gótico",
    idioma: "Español",
    pais: "España"
  },
  {
    id: 50,
    parrafo: "El tiempo es un juego que se juega maravillosamente bien por los niños, pero que los adultos juegan mal, porque han olvidado las reglas. Los niños saben que el tiempo es circular, mientras que los adultos creen que es lineal.",
    opciones: ["El tiempo entre costuras", "La casa de los espíritus", "El juego del ángel", "Tres tristes tigres"],
    respuestaCorrecta: 3,
    dificultad: "dificil",
    autor: "Guillermo Cabrera Infante",
    ano: 1967,
    genero: "Experimental",
    idioma: "Español",
    pais: "Cuba"
  }
];

export const getPreguntasPorDificultad = (dificultad: 'facil' | 'medio' | 'dificil') => {
  return preguntas.filter(p => p.dificultad === dificultad);
};

export const getPreguntasAleatorias = (cantidad: number = 10, dificultad?: 'facil' | 'medio' | 'dificil') => {
  const pool = dificultad ? getPreguntasPorDificultad(dificultad) : preguntas;
  const mezcladas = [...pool].sort(() => Math.random() - 0.5);
  return mezcladas.slice(0, cantidad);
};

export const getPreguntasPorGenero = (genero: string) => {
  return preguntas.filter(p => p.genero.toLowerCase().includes(genero.toLowerCase()));
};

export const getPreguntasPorAutor = (autor: string) => {
  return preguntas.filter(p => p.autor.toLowerCase().includes(autor.toLowerCase()));
};

export const getEstadisticas = () => {
  const total = preguntas.length;
  const porDificultad = {
    facil: preguntas.filter(p => p.dificultad === 'facil').length,
    medio: preguntas.filter(p => p.dificultad === 'medio').length,
    dificil: preguntas.filter(p => p.dificultad === 'dificil').length,
  };
  const generos = [...new Set(preguntas.map(p => p.genero))];
  const autores = [...new Set(preguntas.map(p => p.autor))];
  const paises = [...new Set(preguntas.map(p => p.pais))];

  return { total, porDificultad, generos, autores, paises };
};