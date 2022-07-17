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

<svg width="{size}" height="{size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="mono mono-add {customClass}" {...$$restProps}>
<path xmlns="http://www.w3.org/2000/svg" d="M4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12ZM12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM13.4142 13.4143L15.5356 8.46451L10.5858 10.5858L8.46448 15.5356L13.4142 13.4143Z" fill="#0D0D0D"></path>
</svg>
