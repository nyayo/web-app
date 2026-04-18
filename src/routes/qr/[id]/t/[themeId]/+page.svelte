<script>
  import SvelteSeo from 'svelte-seo';

  export let data;
</script>

<SvelteSeo
        description="QR-code"
        title="QR-code"
/>

<main class="qr-page">
    <section class="qr-card">
        <p class="eyebrow">CardMesh</p>
        <h1>Scan to open this digital card</h1>
        <p class="subtitle">Point your camera at the code to instantly view and save contact details.</p>
        <div class="qr-frame">
            {@html data.qrCode}
        </div>
    </section>
</main>

<style>
  .qr-page {
    min-height: 100vh;
    display: grid;
    place-items: center;
    padding: 1.25rem;
    background:
      radial-gradient(circle at top right, rgba(214, 230, 222, 0.8), transparent 45%),
      radial-gradient(circle at bottom left, rgba(180, 206, 210, 0.62), transparent 45%),
      #ecf1ef;
  }

  .qr-card {
    width: min(100%, 440px);
    border-radius: 1.25rem;
    border: 1px solid rgba(24, 45, 48, 0.12);
    box-shadow: 0 25px 48px rgba(15, 23, 42, 0.16);
    padding: 1.4rem;
    text-align: center;
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(4px);
  }

  .eyebrow {
    margin: 0;
    font-size: 0.73rem;
    text-transform: uppercase;
    letter-spacing: 0.16em;
    color: #27525a;
    font-weight: 700;
  }

  h1 {
    margin: 0.55rem 0 0;
    font-size: 1.4rem;
    color: #182d30;
    letter-spacing: -0.02em;
  }

  .subtitle {
    margin: 0.6rem 0 1rem;
    color: #2f575d;
    font-size: 0.92rem;
  }

  .qr-frame {
    border-radius: 1rem;
    padding: 1rem;
    border: 1px dashed rgba(24, 45, 48, 0.24);
    background: #fff;
    display: inline-flex;
  }
</style>
