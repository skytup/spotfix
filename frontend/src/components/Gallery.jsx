import './Gallery.css';

function Gallery() {
  const galleryItems = [
    {
      image: '/assets/pic1.jpg',
      title: 'Report Any Issues'
    },
    {
      image: '/assets/pic2.jpg',
      title: 'Upvote the Work'
    },
    {
      image: '/assets/pic3.jpg',
      title: 'Suggest improvements'
    },
    {
      image: '/thumbnail.webp',
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