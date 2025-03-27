import './Gallery.css';

function Gallery() {
  const galleryItems = [
    {
      image: 'https://wallpaperaccess.com/full/391995.jpg ',
      title: 'Report Any Issues'
    },
    {
      image: 'https://wallpaperaccess.com/full/283001.jpg',
      title: 'Upvote the Work'
    },
    {
      image: 'https://wallpaperaccess.com/full/549276.jpg',
      title: 'Suggest improvements'
    },
    {
      image: 'https://wallpaperaccess.com/full/13703987.jpg',
      title: 'Earn Points'
    }
  ];

  return (
    <section className="gallery">
      <h3>Highlights</h3>
      <div className="gallery-container">
        {galleryItems.map((item, index) => (
          <div key={index} className="gallery-item">
            <img src={item.image} alt={item.title} />
            <p>{item.title}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Gallery;