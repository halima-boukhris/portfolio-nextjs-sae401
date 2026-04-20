type Props = {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
};

export default function ProjectCard({ id, title, description, image, category }: Props) {
  return (
    <article>
      
      <a href={`/project/${id}`} className="image">
        <img src={`/uploads/${image}`} alt={title} />
      </a>
      <div className="inner">
        <h4>{title}</h4>
        <p>
          {/* Mise en avant de la catégorie pour plus de clarté */}
          <strong>Catégorie : {category}</strong><br />
          {description}
        </p>
      </div>
    </article>
  );
}