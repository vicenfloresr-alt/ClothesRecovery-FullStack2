let blogs = [
  {
    slug: 'moda-gotica-datos-curiosos',
    titulo: '5 datos curiosos sobre la moda gótica que no sabías',
    resumen: 'Desde catedrales hasta pasarelas: te contamos el origen de una estética que nunca pasa de moda.',
    imagen: '/img/blog/moda-gotica.png',
    parrafos: [
      'La estética gótica no nació en una pasarela — nació en clubes nocturnos de Londres a comienzos de los 80, como una rama más oscura y teatral del post-punk. Bandas como Bauhaus y Siouxsie and the Banshees no solo hacían música: su forma de vestir se convirtió en un lenguaje visual que todavía usamos hoy.',
      'Uno de los datos más curiosos es que buena parte de la silueta gótica —los cuellos altos, el encaje negro, las capas— viene directamente del luto victoriano. En la Inglaterra del siglo XIX, vestir de negro tras la muerte de un ser querido era casi obligatorio, y esa estética de duelo terminó reinterpretada un siglo después como símbolo de rebeldía.',
      'La arquitectura gótica medieval (catedrales, arcos ojivales, vitrales oscuros) le dio su nombre al movimiento mucho antes de que existiera la moda gótica como la conocemos — el término se usó primero para describir edificios, y recién en el siglo XX saltó a la ropa y la música.',
      'Hoy esa herencia se mezcla con el streetwear: cadenas, siluetas oversize, tipografías blackletter en logos de marca — el mismo espíritu de hace 40 años, pero con otra silueta. Es exactamente el cruce que buscamos en ClothesRecovery: prendas con actitud, sin importar de qué década vengan.',
    ],
  },
  {
    slug: 'streetwear-circular-segunda-vida',
    titulo: 'La segunda vida de la ropa: cómo nace el streetwear circular',
    resumen: 'Por qué comprar ropa de segunda mano dejó de ser tabú y se convirtió en una declaración de estilo.',
    imagen: '/img/blog/moda-circular.png',
    parrafos: [
      'Hasta hace poco, comprar ropa usada tenía cierto estigma. Hoy es exactamente lo contrario: encontrar una chaqueta vintage con historia se volvió un símbolo de buen gusto, no de necesidad. El cambio no fue casualidad — es resultado de años de conversación sobre el impacto ambiental de la industria textil, una de las más contaminantes del planeta.',
      'Las plataformas de reventa demostraron algo que las tiendas tradicionales tardaron en entender: la gente no solo quiere ropa barata, quiere piezas con carácter que ya no se fabrican. Una chaqueta descontinuada de hace diez años vale más, no menos, que una nueva de fast fashion.',
      'El streetwear fue el punto de encuentro perfecto para esta idea. Marcas de culto empezaron a mezclar piezas de archivo (ropa descontinuada, ediciones limitadas) con colecciones nuevas, borrando la línea entre "ropa nueva" y "ropa usada". Lo que importa ya no es cuándo se fabricó una prenda, sino si tiene actitud.',
      'Ese es exactamente el terreno donde se mueve ClothesRecovery: no vendemos ropa vieja, vendemos piezas que ya demostraron que aguantan el tiempo — y les damos una curaduría real antes de que lleguen a tu clóset.',
    ],
  },
  {
    slug: 'cuidado-cuero-denim-recuperado',
    titulo: 'Cómo cuidar una chaqueta de cuero o un jean recuperado',
    resumen: 'Tres hábitos simples para que una prenda de segunda mano te dure otros diez años.',
    imagen: '/img/blog/cuidado-prendas.png',
    parrafos: [
      'Una prenda recuperada ya sobrevivió a un primer dueño — con el cuidado correcto, puede sobrevivir a varios más. El cuero en particular necesita hidratación cada cierto tiempo: un paño suave y un acondicionador específico evitan que se reseque y se agriete con los años.',
      'El denim envejece distinto: entre menos lavado, mejor. Lavar un jean con demasiada frecuencia rompe las fibras y borra los desgastes naturales que le dan carácter. Airearlo y lavarlo del revés, con agua fría, alcanza para la mayoría de los casos.',
      'Para chaquetas con detalles metálicos (cierres, remaches, cadenas) conviene revisar que no haya óxido antes de guardarlas por temporada. Un poco de aceite en las bisagras del cierre hace una diferencia enorme en cuánto dura la prenda.',
      'En ClothesRecovery cada pieza pasa por una revisión antes de llegar a la tienda, pero el cuidado real empieza después de la compra. Una prenda bien tratada no solo dura más: envejece mejor, y eso es justamente lo que buscamos cuando hablamos de moda circular.',
    ],
  },
];

export function obtenerBlogs() {
  return blogs;
}

export function obtenerBlogPorSlug(slug) {
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].slug === slug) {
      return blogs[i];
    }
  }
  return null;
}

export function agregarBlog(nuevoBlog) {
  blogs.push(nuevoBlog);
}

export function editarBlog(slug, datosNuevos) {
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].slug === slug) {
      for (const clave in datosNuevos) {
        blogs[i][clave] = datosNuevos[clave];
      }
      return true;
    }
  }
  return false;
}

export function eliminarBlog(slug) {
  const restantes = [];
  for (let i = 0; i < blogs.length; i++) {
    if (blogs[i].slug !== slug) {
      restantes.push(blogs[i]);
    }
  }
  blogs = restantes;
}
