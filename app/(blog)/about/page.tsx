export default function AboutPage() {
  return (
    <div className="blog-container">
      <div className="about-page">
        <h1>关于</h1>

        <section className="about-section">
          <h2>关于本站</h2>
          <p>
            这是 VixenAhri 的个人博客，专注于技术分享，记录学习与成长的点滴。
            在这里分享编程技术、开发经验和个人思考。
          </p>
        </section>

        <section className="about-section">
          <h2>关于我</h2>
          <p>
            Hi，我是 VixenAhri，一名热爱技术的开发者。
            喜欢探索新技术，乐于分享知识。
            相信技术可以改变世界，也相信分享可以让技术更有价值。
          </p>
        </section>

        <section className="about-section">
          <h2>联系方式</h2>
          <ul className="about-contact">
            <li>
              <strong>Email:</strong>{" "}
              <a href="mailto:contact@example.com">contact@example.com</a>
            </li>
            <li>
              <strong>GitHub:</strong>{" "}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com
              </a>
            </li>
          </ul>
        </section>
      </div>
    </div>
  );
}
