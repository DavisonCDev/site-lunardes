// Dados dos shows (Futuramente virão do Java)
const tourDates = [
  { id: 1, date: '20 NOV', city: 'SÃO PAULO', venue: 'Cine Joia', link: '#' },
  { id: 2, date: '05 DEZ', city: 'OSASCO', venue: 'Sesc Osasco', link: '#' },
  { id: 3, date: '12 DEZ', city: 'RIO DE JANEIRO', venue: 'Circo Voador', link: '#' },
];

function TourSection() {
  return (
    <section id="tour" className="tour-section">
      <h2 className="outline-title">Próximos Shows</h2>
      <ul className="tour-list">
        
        {/* Mapeando a lista de shows */}
        {tourDates.map((show) => (
          <li key={show.id} className="tour-item">
            <span className="date">{show.date}</span>
            <span className="city">{show.city}</span>
            <span className="venue">{show.venue}</span>
            <a href={show.link} className="btn-ticket" target="_blank">Ingressos</a>
          </li>
        ))}

      </ul>
    </section>
  );
}

export default TourSection;