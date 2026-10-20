import { useRef, useState, type FormEvent } from "react";
import { coupleName, invitation } from "./invitation";

const sections = ["Undangan", "Kisah kami", "Galeri", "Acara", "Konfirmasi"];
const guestName = new URLSearchParams(window.location.search).get("to")?.trim() || "Keluarga dan Sahabat";

function Icon({ kind }: { kind: "calendar" | "clock" | "pin" }) {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      {kind === "calendar" ? <><rect x="4" y="5" width="16" height="16" rx="2"/><path d="M8 3v5m8-5v5M4 11h16"/></> : kind === "clock" ? <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></> : <><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z"/><circle cx="12" cy="10" r="2"/></>}
    </svg>
  );
}

function Arrow({ back = false }: { back?: boolean }) {
  return <svg width="20" height="16" viewBox="0 0 24 18" fill="none" aria-hidden="true" style={back ? { transform: "rotate(180deg)" } : undefined}><path d="M2 9h19m-7-7 7 7-7 7" stroke="currentColor" strokeWidth="1.3" /></svg>;
}

function saveEvent(reception: boolean) {
  const event = reception ? invitation.reception : invitation.akad;
  const title = reception ? "Resepsi Pernikahan" : "Akad Nikah";
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const calendar = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//Undangan Digital//ID", "CALSCALE:GREGORIAN",
    "BEGIN:VEVENT", `UID:${reception ? "resepsi" : "akad"}-${invitation.dateIso}@undangan-digital`, `DTSTAMP:${stamp}`,
    `DTSTART;TZID=Asia/Makassar:${invitation.dateIso.replace(/-/g, "")}T${event.start}`,
    `DTEND;TZID=Asia/Makassar:${invitation.dateIso.replace(/-/g, "")}T${event.end}`,
    `SUMMARY:${coupleName} - ${title}`, `LOCATION:${invitation.venue.replace(/,/g, "\\,")}`,
    "DESCRIPTION:Kami menantikan kehadiran Anda.", "END:VEVENT", "END:VCALENDAR", "",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([calendar], { type: "text/calendar;charset=utf-8" }));
  const link = document.createElement("a");
  link.href = url;
  link.download = `${reception ? "resepsi" : "akad"}-${invitation.dateIso}.ics`;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function App() {
  const [page, setPage] = useState(-1);
  const [copied, setCopied] = useState(false);
  const [rsvpNotice, setRsvpNotice] = useState("");
  const touchStart = useRef<number | null>(null);
  const changePage = (next: number) => setPage(Math.max(0, Math.min(sections.length - 1, next)));

  async function share() {
    try {
      if (navigator.share) await navigator.share({ title: `Undangan ${coupleName}`, url: window.location.href });
      else {
        await navigator.clipboard.writeText(window.location.href);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2500);
      }
    } catch { /* Berbagi dibatalkan atau clipboard tidak tersedia. */ }
  }

  function submitRsvp(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (!invitation.rsvpWhatsApp) {
      setRsvpNotice("Konfirmasi kehadiran belum diaktifkan. Silakan hubungi tuan rumah secara langsung.");
      return;
    }
    const message = [
      `Halo, saya ${String(form.get("name"))}.`,
      `Konfirmasi kehadiran untuk ${coupleName}: ${String(form.get("attendance"))}.`,
      `Jumlah tamu: ${String(form.get("guests"))}.`,
      String(form.get("note") || ""),
    ].filter(Boolean).join("\n");
    window.open(`https://wa.me/${invitation.rsvpWhatsApp}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  }

  return (
    <div className={`app${page === -1 ? " is-cover" : ""}`} onKeyDown={e => { if (page === -1 || (e.target as HTMLElement).matches("input, select, textarea")) return; if (e.key === "ArrowDown" || e.key === "ArrowUp") { e.preventDefault(); changePage(page + (e.key === "ArrowDown" ? 1 : -1)); } }}>
      <header className="header">
        <a className="monogram" href="#" onClick={e => { e.preventDefault(); changePage(0); }} aria-label={`Undangan ${coupleName}`}>{invitation.partnerOne[0]}<span>&</span>{invitation.partnerTwo[0]}<i /></a>
        <span className="header-note">UNDANGAN PERNIKAHAN · DENGAN PENUH CINTA</span>
        <button className="share" onClick={share}>{copied ? "Tautan disalin" : "Bagikan undangan"}<svg width="15" height="15" viewBox="0 0 20 20" fill="none" aria-hidden="true"><path d="M12 3h5v5M17 3l-9 9M8 4H4v13h13v-5" stroke="currentColor" strokeWidth="1.2"/></svg></button>
      </header>

      <main className="invitation" onTouchStart={e => { touchStart.current = page === -1 || (e.target as HTMLElement).closest("input, select, textarea") ? null : e.touches[0].clientY; }} onTouchCancel={() => { touchStart.current = null; }} onTouchEnd={e => { if (touchStart.current === null) return; const delta = touchStart.current - e.changedTouches[0].clientY; if (Math.abs(delta) > 55) changePage(page + (delta > 0 ? 1 : -1)); touchStart.current = null; }}>
        <div className="photo-panel">
          <img src={invitation.coverPhoto} alt={`Foto ${coupleName}`} />
          <div className="photo-shade" />
          <span className="photo-top">BERSAMA ADALAH TEMPAT TERINDAH</span>
          <div className="photo-caption"><span>PERAYAAN CINTA</span><p>{coupleName}</p><div>{invitation.dateLabel.toLocaleUpperCase("id-ID")} <span>·</span> {invitation.city.toLocaleUpperCase("id-ID")}</div></div>
          <span className="photo-credit">Foto: Unsplash</span>
        </div>

        <div className="content-panel">
          <div className="corner-flower" aria-hidden="true">❧</div>
          <div className="page-number">{page === -1 ? "UNDANGAN KHUSUS UNTUK ANDA" : <><span>0{page + 1}</span> / 0{sections.length}</>}</div>
          <div className="slide-viewport"><div className="slide-track" style={{ transform: `translateY(-${(page + 1) * 100}%)` }}>
            <section className="slide slide--cover" aria-label="Sampul undangan" aria-hidden={page !== -1} inert={page !== -1}>
              <div className="eyebrow"><span /> UNDANGAN PERNIKAHAN <span /></div>
              <h1>{invitation.partnerOne}<span className="ampersand">&</span>{invitation.partnerTwo}</h1>
              <p className="description">{invitation.dateLabel}</p>
              <div className="guest cover-guest"><span>Kepada Yth.</span><p>{guestName}</p></div>
              <button className="primary open-invitation" onClick={() => changePage(0)}>Buka undangan <span className="open-arrow"><Arrow /></span></button>
              <p className="swipe-hint">Ada hari istimewa yang ingin kami bagi bersama.</p>
            </section>

            {sections.map((name, index) => <section key={name} className={`slide slide-${index}`} aria-label={name} aria-hidden={index !== page} inert={index !== page}>
              {index === 0 && <>
                <div className="eyebrow"><span /> DENGAN PENUH SUKACITA <span /></div>
                <p className="intro">Kami mengundang Bapak/Ibu/Saudara/i</p>
                <h1>{invitation.partnerOne}<span className="ampersand">&</span>{invitation.partnerTwo}</h1>
                <p className="description">Untuk hadir dan berbagi kebahagiaan<br />pada hari pernikahan kami.</p>
                <div className="date-block"><span>{invitation.dateLabel.split(",")[0].toLocaleUpperCase("id-ID")}</span><strong>{invitation.dateLabel.match(/\d{1,2} \w+ \d{4}/)?.[0] || invitation.dateLabel}</strong><span>{invitation.venue.toLocaleUpperCase("id-ID")}</span></div>
                <div className="guest"><span>Undangan untuk</span><p>{guestName}</p></div>
                <button className="primary" onClick={() => changePage(1)}>Kisah kami <Arrow /></button>
                <p className="swipe-hint">Geser ke atas untuk melanjutkan</p>
              </>}
              {index === 1 && <>
                <div className="eyebrow"><span /> PERJALANAN KAMI <span /></div>
                <h2>Dari sebuah sapaan<br /><em>menjadi selamanya.</em></h2>
                <p className="description story-intro">Setiap pertemuan membawa cerita.<br />Inilah beberapa bab yang ingin kami kenang.</p>
                <div className="story-timeline">
                  <div><span>AWAL</span><section><h3>Pertama bertemu</h3><p>Sebuah perkenalan sederhana menjadi awal dari cerita yang istimewa.</p></section></div>
                  <div><span>BERSAMA</span><section><h3>Banyak cerita</h3><p>Hari-hari yang kami lalui mengajarkan arti tumbuh dan saling mendukung.</p></section></div>
                  <div><span>SELAMANYA</span><section><h3>Menuju hari bahagia</h3><p>Kini kami siap memulai babak baru, dan bahagia jika Anda hadir bersama kami.</p></section></div>
                </div>
                <button className="primary" onClick={() => changePage(2)}>Lihat momen kami <Arrow /></button>
              </>}
              {index === 2 && <>
                <div className="eyebrow"><span /> MOMEN KECIL, CINTA YANG BESAR <span /></div>
                <h2>Sekilas cerita<br /><em>tentang kami.</em></h2>
                <div className="gallery-grid">{invitation.gallery.map((image, imageIndex) => <figure key={image.id} style={{ animationDelay: `${200 + imageIndex * 100}ms` }}>
                  <img src={`https://images.unsplash.com/photo-${image.id}?auto=format&fit=crop&w=650&q=85`} alt={image.alt} loading="lazy" />
                  <figcaption>{image.credit} / Unsplash</figcaption>
                </figure>)}</div>
                <button className="primary" onClick={() => changePage(3)}>Detail acara <Arrow /></button>
              </>}
              {index === 3 && <>
                <div className="eyebrow"><span /> CATAT TANGGALNYA <span /></div>
                <h2>Hari bahagia<br /><em>kami.</em></h2>
                <p className="description event-intro">Merupakan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir dan memberikan doa restu.</p>
                <div className="event-cards">{[false, true].map(reception => {
                  const event = reception ? invitation.reception : invitation.akad;
                  return <article className="event-card" key={String(reception)}>
                    <h3>{reception ? "Resepsi" : "Akad Nikah"}</h3>
                    <p><Icon kind="calendar" /> {invitation.dateLabel}</p>
                    <p><Icon kind="clock" /> {event.time}</p>
                    <p><Icon kind="pin" /> {invitation.venue}</p>
                    <button className="calendar-button" onClick={() => saveEvent(reception)}><Icon kind="calendar" /> Simpan ke Kalender</button>
                  </article>;
                })}</div>
                <div className="venue-map"><iframe title={`Peta ${invitation.venue}`} src={`https://maps.google.com/maps?${new URLSearchParams({ q: invitation.mapQuery, output: "embed" })}`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen tabIndex={page === 3 ? 0 : -1} /></div>
                <a className="text-link" href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(invitation.mapQuery)}`} target="_blank" rel="noreferrer">Buka di Google Maps ↗</a>
                <button className="primary" onClick={() => changePage(4)}>Konfirmasi kehadiran <Arrow /></button>
              </>}
              {index === 4 && <>
                <div className="eyebrow"><span /> KEHADIRAN ANDA BERARTI <span /></div>
                <h2>Sampai jumpa<br /><em>di hari bahagia.</em></h2>
                <p className="description">Mohon konfirmasi sebelum {invitation.rsvpDeadline}.<br />Kami menantikan kehadiran Anda.</p>
                <form onSubmit={submitRsvp}>
                  <label>Nama lengkap<input name="name" placeholder="Nama dan nama keluarga" required autoComplete="name" /></label>
                  <div className="form-row"><label>Konfirmasi kehadiran<select name="attendance"><option>Hadir</option><option>Mohon maaf, belum dapat hadir</option></select></label><label>Jumlah tamu<select name="guests"><option>1 orang</option><option>2 orang</option><option>3 orang</option><option>4 orang</option></select></label></div>
                  <label>Pesan <span>(opsional)</span><textarea name="note" placeholder="Sampaikan doa dan harapan Anda…" rows={2}/></label>
                  <button className="primary" type="submit">Kirim konfirmasi <Arrow /></button>
                  {rsvpNotice && <p className="rsvp-notice" role="status">{rsvpNotice}</p>}
                </form>
              </>}
            </section>)}
          </div></div>
          <div className="slide-controls" inert={page === -1}><button onClick={() => changePage(page - 1)} disabled={page === 0} aria-label="Halaman sebelumnya"><Arrow back /></button><div className="dots">{sections.map((name, index) => <button key={name} className={index === page ? "active" : ""} onClick={() => changePage(index)} aria-label={name} aria-current={index === page ? "step" : undefined}/>)}</div><button onClick={() => changePage(page + 1)} disabled={page === sections.length - 1} aria-label="Halaman berikutnya"><Arrow /></button></div>
        </div>
      </main>
      <footer inert={page === -1}><span>DIBUAT DENGAN CINTA UNTUK ORANG-ORANG TERSAYANG</span><nav aria-label="Bagian undangan">{sections.map((name, index) => <button key={name} onClick={() => changePage(index)} className={index === page ? "selected" : ""}><span>0{index + 1}</span> {name}</button>)}</nav><span className="footer-date">{invitation.partnerOne[0]} & {invitation.partnerTwo[0]} <i>·</i> {invitation.dateShort}</span></footer>
    </div>
  );
}
