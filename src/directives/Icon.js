export default {
  beforeMount(el,binding) {
    const iconClass = `fa fa-${binding.value} text-green-600 text-xl mr-2`;

    el.innerHTML += `<i class="${iconClass}"></i>`;
  }
}
