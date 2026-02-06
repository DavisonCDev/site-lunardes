function NewsletterSection() {
  
  const handleSubmit = (e) => {
    e.preventDefault(); // Impede a página de recarregar
    alert("Valeu! Em breve (quando tivermos backend) isso vai salvar seu e-mail.");
  };

  return (
    <section id="newsletter" className="newsletter-section">
      <div className="newsletter-container">
        <h2 className="newsletter-title">JUNTE-SE AO CLUBE</h2>
        <p>Receba lançamentos, datas secretas e merch drops antes de todo mundo.</p>
        
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <input type="email" placeholder="SEU E-MAIL AQUI" required />
          <button type="submit">INSCREVER</button>
        </form>
      </div>
    </section>
  );
}

export default NewsletterSection;