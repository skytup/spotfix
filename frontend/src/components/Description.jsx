function Description() {
  return (
    <div className="description-more">
      <section className="description">
        <h3>About SpotFix</h3>
        <p>
          SpotFix is more than just a platform; it's a movement to empower
          individuals like you to take charge of your surroundings. Whether it's
          a pothole on your street, an overflowing garbage bin, or a safety
          concern in your neighborhood, SpotFix ensures your voice is not only
          heard but also rewarded.
        </p>
        <p>
          By reporting issues, you become an active participant in creating a
          cleaner, safer, and more vibrant community. Your contributions matter,
          and with every report, you earn Fix Points as a token of appreciation
          for your efforts. Together, we can make a difference, one issue at a
          time.
        </p>
        <p>
          Join us in this journey to transform our communities into better
          places to live. SpotFix is here to bridge the gap between individuals
          and authorities, making it easier than ever to bring about positive
          change. Let's fix it together!
        </p>
      </section>
      <section className="features">
        <h3>Why Choose SpotFix?</h3>
        <ul>
          <li>
            <i className="fas fa-check-circle"></i> Easy-to-use interface for
            reporting issues.
          </li>
          <li>
            <i className="fas fa-check-circle"></i> Earn Fix Points for every report
            you make.
          </li>
          <li>
            <i className="fas fa-check-circle"></i> Track your contributions and
            progress.
          </li>
          <li>
            <i className="fas fa-check-circle"></i> Join a community dedicated to
            improvement.
          </li>
        </ul>
      </section>
      <section className="about">
        <h3>What is SpotFix?</h3>
        <p>
          SpotFix is a collaborative platform that allows individuals to report
          issues in their surroundings and contribute to creating a better
          environment. By reporting issues, users can earn rewards and track
          their impact.
        </p>
      </section>
      <center>
        <img
          style={{
            width: 'auto',
            margin: '10px 0px',
            maxWidth: '90%',
            borderRadius: '10px'
          }}
          src="/assets/travel.jpg"
          alt="Finding a location"
        />
      </center>
    </div>
  );
}

export default Description;