export default (script: string) => `
<script type="text/javascript">
  Office.onReady(function () {
    ${script}
  });
</script>
`;
