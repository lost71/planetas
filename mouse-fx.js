/**
 * Efeitos Visuais & Iluminação RGB LED
 * O antigo efeito de rastreamento de partículas do mouse foi desativado conforme solicitado,
 * sendo substituído pelo novo efeito de fita de LED RGB Gamer ultra colorido com aceleração de hardware.
 */

class CosmicMouseFX {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) {
      return;
    }
  }
}

window.CosmicMouseFX = CosmicMouseFX;
