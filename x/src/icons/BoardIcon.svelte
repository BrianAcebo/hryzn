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

<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mono mono-board {customClass}" {...$$restProps}>
<path d="M2 5C2 3.89543 2.89543 3 4 3H20C21.1046 3 22 3.89543 22 5V19C22 20.1046 21.1046 21 20 21H4C2.89543 21 2 20.1046 2 19V5ZM8 5H4V19H8V5ZM10 5V19H14V5H10ZM16 5V19H20V5H16Z" fill="#0D0D0D"/>
</svg>
