<script>
    import '../app.css';
    let { children } = $props();
</script>

<div class="min-h-screen bg-gradient animate-gradient">
    <div class="fixed inset-0 opacity-30 pointer-events-none"></div>
    <main>
        {@render children()}
    </main>
</div>

<style>
    :global(:root) {
        --ctp-rosewater: #f5e0dc;
        --ctp-flamingo: #f2cdcd;
        --ctp-pink: #f5c2e7;
        --ctp-mauve: #cba6f7;
        --ctp-red: #f38ba8;
        --ctp-maroon: #eba0ac;
        --ctp-peach: #fab387;
        --ctp-yellow: #f9e2af;
        --ctp-green: #a6e3a1;
        --ctp-teal: #94e2d5;
        --ctp-blue: #89b4fa;
        --ctp-sapphire: #74c7ec;
        --ctp-lavender: #b4befe;
        --ctp-text: #cdd6f4;
        --ctp-subtext1: #bac2de;
        --ctp-subtext0: #a6adc8;
        --ctp-overlay2: #9399b2;
        --ctp-overlay1: #7f849c;
        --ctp-overlay0: #6c7086;
        --ctp-surface2: #585b70;
        --ctp-surface1: #45475a;
        --ctp-surface0: #313244;
        --ctp-base: #1e1e2e;
        --ctp-mantle: #181825;
        --ctp-crust: #11111b;
    }

    .bg-gradient {
        background: linear-gradient(-45deg, 
            var(--ctp-base),
            var(--ctp-mantle),
            var(--ctp-surface0),
            var(--ctp-crust)
        );
        background-size: 400% 400%;
    }

    .animate-gradient {
        animation: gradient 45s cubic-bezier(0.4, 0, 0.2, 1) infinite;
    }

    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    .bg-noise {
        background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    main {
        position: relative;
        z-index: 1;
    }
</style>
