<script>
  export let size = '100%';
  let customClass = '';
  export { customClass as class };

  if (size !== "100%") {
    size = size.slice(-1) === 'x' 
          ? size.slice(0, size.length -1) + 'em'
          : parseInt(size) + 'px';
  }
</script>

<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mono mono-bar-chart {customClass}" {...$$restProps}>
<path d="m3 5c0-1.10457.89543-2 2-2h14c1.1046 0 2 .89543 2 2v14c0 1.1046-.8954 2-2 2h-14c-1.10457 0-2-.8954-2-2zm16 0h-14v14h14zm-7 2c.5523 0 1 .44772 1 1v8c0 .5523-.4477 1-1 1s-1-.4477-1-1v-8c0-.55228.4477-1 1-1zm4 2c.5523 0 1 .44772 1 1v6c0 .5523-.4477 1-1 1s-1-.4477-1-1v-6c0-.55228.4477-1 1-1zm-8 2c.55228 0 1 .4477 1 1v4c0 .5523-.44772 1-1 1s-1-.4477-1-1v-4c0-.5523.44772-1 1-1z" fill="#0d0d0d"/>
</svg>
