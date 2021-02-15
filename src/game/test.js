/* eslint-disable max-len */
import Phaser from 'phaser';

const game = new Phaser.Game(500, 500, Phaser.CANVAS, '', {
  preload() {
    this.scale.pageAlignHorizontally = true;
    this.game.stage.backgroundColor = '#FFFFFF';

    this.game.load.image('pieza', piezaUrl);
    this.game.load.image('aumentar', aumentarUrl);
    this.game.load.image('reducir', reducirUrl);
    this.game.load.image('reflejar', reflejarUrl);
    this.game.load.image('rotar', rotarUrl);
    this.game.load.image('mouse', mouseUrl);

    this.maxZoom = 1.3;
    this.minZoom = 0.9;
    this.zoomFactor = 0.1;
    this.maxAngle = 360;
    this.angleFactor = 90;

    this.actualPosition = {
      x: this.game.world.centerX,
      y: 350,
    };

    this.origen = {
      angle: 90,
      scale: 1,
    };

    this.destino = {
      angle: 0,
      scale: 1.2,
    };

    this.currentSprite;
    this.moveSprite;
  },
  create() {
    this.piezaDestino = this.game.add.image(this.game.world.centerX, 100, 'pieza');
    this.piezaDestino.anchor.set(0.5);
    this.piezaDestino.alpha = 0.8;
    this.piezaDestino.angle = this.destino.angle;
    this.piezaDestino.scale.set(this.destino.scale);

    this.piezaOrigen = this.game.add.image(this.actualPosition.x, this.actualPosition.y, 'pieza');
    this.piezaOrigen.anchor.set(0.5);
    this.piezaOrigen.angle = this.origen.angle;
    this.piezaOrigen.scale.set(this.origen.scale);
    this.piezaOrigen.inputEnabled = true;
    this.piezaOrigen.input.useHandCursor = true;
    this.piezaOrigen.events.onInputDown.add(this.selectCurrent, this);
    this.piezaOrigen.input.enableDrag();
    this.piezaOrigen.events.onDragStop.add(this.onDragStop, this);
    this.piezaOrigen.selected = false; // útil para el Drag and Drop

    this.aumentar = this.game.add.button(30, 30, 'aumentar', function () {
      if (this.currentSprite) {
        let newScale = Math.abs(this.currentSprite.scale.x) + this.zoomFactor;
        if (newScale > this.maxZoom) {
          newScale = this.minZoom;
        }
        if (this.currentSprite.scale.x < 0) {
          newScale *= -1;
        }
        this.currentSprite.scale.set(newScale);
      }
    }, this);
    this.aumentar.input.useHandCursor = true;
    this.aumentar.anchor.set(0.5);
    this.aumentar.scale.set(0.8);

    this.reducir = this.game.add.button(30, 80, 'reducir', function () {
      if (this.currentSprite) {
        let newScale = Math.abs(this.currentSprite.scale.x) - this.zoomFactor;
        if (newScale < this.minZoom) {
          newScale = this.maxZoom;
        }
        if (this.currentSprite.scale.x < 0) {
          newScale *= -1;
        }
        this.currentSprite.scale.set(newScale);
      }
    }, this);
    this.reducir.input.useHandCursor = true;
    this.reducir.anchor.set(0.5);
    this.reducir.scale.set(0.8);

    this.reflejar = this.game.add.button(30, 130, 'reflejar', function () {
      if (this.currentSprite) {
        this.currentSprite.scale.set(this.currentSprite.scale.x * -1);
      }
    }, this);
    this.reflejar.input.useHandCursor = true;
    this.reflejar.anchor.set(0.5);
    this.reflejar.scale.set(0.8);

    this.rotar = this.game.add.button(30, 180, 'rotar', function () {
      if (this.currentSprite) {
        let newAngle = this.currentSprite.angle + this.angleFactor;
        if (newAngle >= this.maxAngle) {
          newAngle = 0;
        }
        this.currentSprite.angle = newAngle;
      }
    }, this);
    this.rotar.input.useHandCursor = true;
    this.rotar.anchor.set(0.5);
    this.rotar.scale.set(0.8);

    this.mouse = this.game.add.sprite(this.game.world.centerX, 400, 'mouse');
    this.mouse.anchor.set(0.5);
    this.game.add.tween(this.mouse.scale).to({ x: 1.4, y: 1.4 }, 800, 'Linear', true, 0, -1).yoyo(true, 100);
  },
  selectCurrent(sprite) {
    this.mouse.alpha = 0;
    if (this.currentSprite) {
      if (sprite.selected) {
        return;
      }
      this.currentSprite.selected = false;
      this.currentSprite.tint = this.currentSprite.prevTint;
    }
    this.currentSprite = sprite;
    this.currentSprite.selected = true;
    this.currentSprite.prevTint = this.currentSprite.tint;
    this.currentSprite.tint = Math.random() * 0xffffff;
  },
  checkOverlap(spriteA, spriteB) {
    const boundsA = spriteA.getBounds();
    const boundsB = spriteB.getBounds();

    return Phaser.Rectangle.intersects(boundsA, boundsB);
  },
  onDragStop(sprite) {
    const self = this;
    if (this.checkOverlap(sprite, this.piezaDestino)
       && sprite.angle.toFixed(1) === this.destino.angle
       && sprite.scale.x.toFixed(1) === this.destino.scale) {
      sprite.inputEnabled = false;
      this.game.add.tween(sprite).to({ x: this.piezaDestino.x, y: this.piezaDestino.y }, 200, Phaser.Easing.Linear.None, true).onComplete.add(() => {
        sprite.animateRotate = true;
        self.piezaDestino.alpha = 0;
        self.game.add.tween(sprite.scale).to({ x: 0.5, y: 0.5 }, 2000, Phaser.Easing.Linear.None, true);
        self.game.add.tween(sprite).to({ alpha: 0 }, 2000, Phaser.Easing.Linear.None, true);
      });
    } else if (this.moveSprite && !this.moveSprite.isRunning || !this.moveSprite) {
      this.moveSprite = this.game.add.tween(sprite).to({ x: this.actualPosition.x, y: this.actualPosition.y }, 500, Phaser.Easing.Linear.None, true);
    }
  },
  update() {
    if (this.currentSprite && this.currentSprite.animateRotate) {
      this.currentSprite.angle += 10;
    }
  },
});

var piezaUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAAB8CAYAAAChbripAAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAALEwAACxMBAJqcGAAAHAhJREFUeJztnXuUVNWV/79736p+8BJjVNBGjSIqKtBVDTZg1+02kvRSuqs7Ur6SmfySmcHEmIyPODHqbxLzSzQZmaiT56jjz8lM1AiR7i5N8AVU0SJCVzWgwWjwAbSC+OJNd3XX3vNHgzbQVXVu3VvVYOazlmtJ33PO3veeXfeex977EI5gKs9vmMQWbhal0p73Si9bt25+qhhybdsu26GjFzBhG7PcsWpJ9E/FkFsIaKgVyIfKUNN0QG9hwsUf/VH18b3vlV5SaCOwbbtsB45qZdDn9ksW1VYQftQZa+sopOxCcEQZQJXdeGFa9BZmrh20QIGNYJDOP1C84Bli/CgRa11aCPmF4EgwAArWNjSK4mYGT8tVWBRP7BzWc8n6RYt6vFSiv/NHtzEwK1dZhSwH0e3JpW1PeKlDIThsDSASiVivvZO6TFW/y0znOKkrkD/sLO/9gldGUF09p7yntLfVpPMPQHWNgm9PxicvAG4TL3TxmsPOACZOjJSUHdvzZRX9DjOflm87Cv3jjvJUs1sjqK6eU57y97YR48L8dZFXWeknunvMfyUS9/a60cdrDhsDCAZnD9MR1lwSfBuME71o060ReNH5AxFgIwPz/D3++1esWLDXizbdMuQGELwwchRSPdeI0rXM+LTnAgSLRvC25lgs1u2kWnX1nPLeklQURJ/1XCfIVoDusvamfrly5aId3rdvzpAZwJTz5xxrce91QvgGA6MKKkzlyRG0o8nUCArb+QMQ2abEP7f8dPeqZ1veL6isDBTdAKbZzRW9kBsB+QcGlxdLrkCfGoXt4VxGEAzOHoYRVhTABUVSDRDsVsK92qfzOpe3vV00uSiiAVTaDeMJdBNB/wbgkmLJHUguIxiSzj8ASUH4P9VHP0kuaXmtGBILbgCBuqbTkNYfqkqEmS2v2hWRNJj3MDDSWUWsACMx+CWZarLWcGAd7GTIcIDZkR7Z2hRJg/E7v+DWlcuib3jV7mD4Ctk4AEC0jgiXE3n1fCSloP8C48cWuEyRXgzQscbVGdUAqge/5ExHEbwDojoWKy2kNwnLlxjsd9TIYHr0/1Cu7IM8BeAINwDCJqj7ZgTYw8B9FnzzVsYWdu3/e5XdfIFjI/CA/Z3fGW95ed+fvhqcOfv7auFGJfk7j8Y3mzxoIysF/wRUhprOYtJ1eTcgsh1Mv0inS+5e3b7g3cGKVNnN5xTTCESwBUQXDOj8A5g0vfk4yy/XgXC1mxmOQE7vjEXX569pbgpuABPtyIhypHY6r6nvqtLdVFLyi8Qz87fnKj21ruFsESwG+Lh89DRFBFuY03WJ2ON/zlV2sh0e7YNeI6LXMvMxDkXpCGwb5nT9wilFmQUE7fAHAI42KasiXSCaR7vlvkTi8T1O5BTaCJx0/kAmzZo13J8qnwuhG8xXOWVrIhY9Ph89neDZyDUHpt+yb3W/X3ZaMt52j9POB4BVS6J/SqepTgTvOK2bC4Fstnxa67TzAWDt00/vTsTa7tr7fsmpgF5vVEkL//0HimQAYngzkpaY27381e1t60DeGoFANltMdR1L2l5x0866dfNTyhw3k0mfHAOA6kaTYuSjcV6I64y3vOyVEQhksy9t1brt/P2QqNk9Ehk9M7cUxQCI1cyalU/ySuYAI9jiopm3fWmrdlV7y6te6aWqRvdIRZgCAsVYBwAAoY0mpkZq+OswpDPe8vKk6c2TfSVyQj71e9P+txIZpp75QoDZPWpx3gBFMQAFNhlNNwievQH2s/b5hVsBbPW63bwxvEct0hugOINANrZmT98AhylG9yi+3k/OGMC36/i3AMntEyfi+RvgsEMo5z2KoG/N4qrNxVCnKAaQSNzbK8g9IhfGicD3irU2UXRs2/aBZWzOgoy3i+VEWryHrZzzlcZgf+WMzjHFUGco2MHHnGi0bSxm02YvKJoBMOEtk3JU8skdB7CI0b0xq9Gz8oKiGEDl+Q2TBKg3KUv6yTUAmA5yBRdPrWs4u8C6ACiCAVRXz/kULFrIwDCjCur9VPCwwXARCMwjpI9bJtvh0QXWqLAGEIlErJ7S1MMMOtW0jhIKvgM2VCjBfJeSMZ4hvy30oLigjb+2tef2TIGUgyGQzRDr7kLqNJT4wHc52Z9g8EUBe/UPCqlTwfwBAqGmS4n0d+Y1JCVq1XbGW54vlE6HA4FQuEZJnnXgO6iiMqczHn2sEPrkZQAT7ciIUu0dx0hXCFEFKcaRUoWyVii0gsEVMHQA2Y8qXZWMt9ybjz5HGoGaxm8Q088dVvtQIF0ANjGoS0FdCu1i1S6Qbuot6dm09umndzvVJaMBBEKNdaR0qpJWgDCOVCsUXEEqFWA+yqmg7Oi9iVjbVd62eXgTrAk/AMZXPG1UZLsSd5Fik5B0EaiLlLrIovUdS1tig1UZ1ACmTasflS73f+ilr3smFLK8+92yumKldzlcGF9fXzpyrz/uNA4hH0TQly7bM3qwN8SgHdxXWlZdjM7vH/T55vy1dT4ArF+0qEcs+UIh3NcOhhk+X0/5oIY2aCcT68zCqgQAkoJalySXLSzKpsfhyJrFT7zFTHMEUvCcAUQYtE8H9QdQwQzPAnkyoKBrijnir66eU54q7ZkMwRlKdBopRhNoRL8uuksJ2xhYr4xXSrpL1hYrfj8Ra2kPhMLXgvCLQspRYMZgfz9kDBCJRKzXt3RvA/OIwikj/56MRb9WqPb3E5w5+yT10RcJXA9ItXFQqqBHSVcQYREJ/bZjWWvBnTMCdvg/CPhqwQSIbEssi34KODBO6xADqAo1VipRslB6FGPQV2k31DP4RgB1cL/WoSp4FqA7k8tanvJAvUEZX19fOnJPaYwJ5xVKBoHP7YgtfGng3w550SsV9Pv/toV0wdK4VdWEZwRrwqsY/Ef0h3h7sdBFxLiQWJ+stBteCNQ2FqSD1i9a1CO+vksKOShUkUP69pAHFKhpfIiYrshXiIikCdhMTJsA6lJFF5FuAtDVB1q1Jtb6Zr5tZ2LGjMaR3X66m4CvoPDRTgrB/Xu55Pp1sfm7vG58Wk3DZ9JMVVCMU1AFgHGkqFBIhQJj3YTYK/CbZKz1ywP/dsjDqrTDGxi5d+QUaAOwHsAmgnYptCttyaYJxwzbMn/+/HS+SjqlKtRYqUqPgjG+WDIBQBSvQOTSzvbo2mLJjEQi1oatfWP70FdBoHEAKhRUQaoTQDQ7V30Rea1zWfSA53SAAUyzmyvSkJwDHgF2dMamHD3Uue8CtY0Xq9KjxlvNXiPYrRYuSS5tfXJI5O/Dtm3fLhm9DYzhucr6LBnzwuLoR5+ZA8YAvYN8IzLwwlB3ftBuukLT1OK880UUeENElgISBSQqIksVeMPIcXUgjOGqEg2Emi51poO3xGKxPoGsMimb6jtwPeDAdQAefK54MKT6nLF2BSBgN80W0d8wm8U1iOA9IjwCxuN9/u72TJsmk2bNGm6lymoY1CDQyxn8qVxtM9gvlP7vQG14+1C+CYj5OQC1uQvSDAAf7Swe8ABZZSYMVoAIutyxhh4xpa55skrfo8ycs/MF2EhKP9o5vPs/TZJF7jOMRQAWja+vv/6ovSVfUdFbiLkiWz0G+5HG76fWNZw3VKnjSbHcZPjLQge8AT6qMmnWrOFW97BtuX5VIpIuT9PRy5e35ZH0wR39o33tIPCE7CVFFHQn7ZIf5BNmPpBJs2YN9/eUfx9ENyD3DGMddqWnupWZD+eef/HRJZbvfeTUUVIjsOOo/YknPvq5+3rKp5m8Ugl4cSg6HwB6/JiXq/MF8oEQfy4Za7vJi45Y+/TTuxPxthtVqB4i23IUn6jD+MduZebDi+1PfKgKg1Q8XLILR1d99K/9/5Nps+BgiGlIXv/9CzD0DzmKvQ21zu9c2vqs1/KTy1qeIvbV5Io2VujVgZrZAa/lm0AKs77Rjxf7Pv7gH/RtyFyXhmYAqPpTZHm9CeSDdFpnZUrc5AUdsYUvQeXzEMmYs4iZLQX9a6F0yIZCzPqG5BADIECmGwmxrKIbQCDUWEfgbDMUBfDF1e1t+WcjM6SzPbqWiP42Wxlmrg3WNhRhS/1AlGHUNyIfz/YYAKrs5rON3LwEb3UueWxD3hrmiYJuyHZdgJ91xqKLiqVPR7ytTRW/zqqT0LeLpc9++lPKSc5QeGY+pqqu8QxgnwEMtkkweE3Db4yHTLUvGgOVjFFFIninvFdvLaZOAJAmfFdEMmf4Jr146mebnKaGc42o4Rgt3T/m6zcAmO0AKopvAGn1XZZtA4QY84ZiVrIm1rqNmTLGMDDYL30SKaZOAEBk1kdCNMAA2GwGAKGCf2MPRkkzBpYIZK9vb8+QuZL7e0p+CUiWrW3zoBivICWjhSjV/j6n8y5oOL4vzUaJlATYSaq3JuOVPy/GXkD/JseoDzN5J6nikWS8Ne+tay8I2uHfA/hChssfJmJTPl2MZxWJRKzXt/Z8C6I/MPTmUvbRsXzw5kA2GBhJRPcE7NUrqkKNlS70NWIXRo7PdjME/WOhdciFQrMNPo+eVpM8udA6BOqaguu3plYC9FMHrnzU16szmIgdT1cImJpWXRUIhX860Y4UzHcQRGdkvSy+9oLJNoQgy7Jd72VkvQc3zJjROLLSDt+jfekXGHC8+ESkM5nEbAfwYJjZIsJ1peheVxVqbMynjVyo0CmZromgu6P93DcLIdcRu054TQR9mS4z6JRCiK0MNXyhx6KXGfhWvl5CKpjJyrLGjSIMHqdErZWhxoXT7Oasu2aOIcqYap0hW4baJwHoz3/EnCUNnWa+h3wIzpx9UtBuaGPi37s8Xk+ZaQ0nY9GvEVGtCBwnQR4IEzWlpe/lgB2+NhKJeHQ0jGb0cBGQ5/54+SKKjNNQdXqkTQYikYgVCIVvAFvrAG5w2dw6gEKJWOs1DAAdS1tiPe+XTFbgn0WQf3565hEE3LV+a2qlJylOlDJHzBC5PprFK4iQOd6A4NoDOhAKn/valu4OIswzcfvKhED2quIW7Dp+SiLW0g4M2Axat25+Khlr/X9KfZOg6mo3jYFAWtgsLXoWCMj8K1cUPH2KKYSsurhfpFK9kZinuGtDnrTS/nOS8dbbBx5fe4j7z+r4E39JxNsuVNEvmawrZ5Sn5tPLTBA0Y55eZhw/Y0ajJ69XN+xb7s2YC0FB77mVYbxQNwgi2ELQKxLxaH1H+2OvH3w9o/9Xclnbb1NpOROC+wDnxz4x4YygPdvVUbBKnDVLd4+fJ7tp3wvSqXRWHSztc5Vmfqp90RgnOZYGoKr4tTDO6oi1PZKpUFYHwBfbn/gwsax1LkhqVOHY14006xauAX1ZB6aqMkQHPH4McdbjZZW73RmAkt/xr18gL4rSzGS89etrYq1ZvZiMYoATS6PP0e7jKxVys0CMo2bF0Msoo9zY4++JIuMDVEXRN1sO0QE6J8vlF90eDi1i/gwF2APFd0ZhR8A08to4CDyRuLc3GYveYaX95wjwtEkdzXORaSBMmQekzHROoWL1TKisaQxl81FUhWvXtExh3YcgWCTA2Yl467/EYrGMC1MH4zgLQEf7Y6+X9vgvh9G4gKomToy4OydYtSXrdaHvumrfBUx6c9brTK1u2q+unlMOEoMlXhGrp+eyfOIu80oDsWLFgg8AyblwxIyy0k/3BvORsZ9EPPAsJHOeYSKEg3a41o2MfKi0G+pB/PmMBUTe7FjaYnRAVCZ6/KmpZunk+KV8PzV55wERNfM/I9fh5rcJGPdnK6GQfy/optRBTJtWPwqgrBk9lDiv2dNATFP1iOQfqZV/Ihgycz1SdZ9vwN/j/zfJsqBC4AllmrrPrRxDqK+s5IGsUzORbb7uHqd5AA9B1XCnljlvT628DcCXZiOrY1LXA8EVKxZ8ANWsKWSJcHkw1HinW1m5CNrhu4jokqyFmP7V7egfAIHMPLX9ki7+G6D/KLXMK3UDRBxXaTe4jt0vTZXcAZE3sxYi+nYgFP5ZIRIsRyIRK2A3/BrAP+Yo+pft5SnXhlgZajrTJDhVIJtXLovmfcR83g9q4sRICQRGoVfkYC6biRUrFuxVi7+GHN9VIlwTDHU+NdW+yLOTRwI1zWPXb+l+hsA5spmKqOpVJoGouTAfO9HeYHBu3htjeRtA+bGpm8Fk5O5EcO51NBjJpa1PKvRfcgukzwr86wJ209dt2877aLxgcK4/aDdcQ+h7mZlrc9fgHybjbUvylTcQMhw7MehUDN/yT/nKycsAKkNNZwFiPP9Whmcnb47E9luhYhKHfzRBf7lLRv0lYIevnTS92ThX/3kXNBwfDDVeLyPeWQ/wz4yCZlQfT8Sm3GYqIyeUeQX0YETp1imhi0/PT0wedSprGuPMdL5JYQE6xx9XMtXLvEGTZs0abvUMe9ZJSjUR9DHrKlGKgehPDLyZZtoJAJboSIJ+Jq2YyIpagUx14mYliudKU/5ZXiaXtG3btwOjkgw+10gHkaWdy6J1TuU4NoBgTfgqcPawqAFKpclnnZdc0pJwKicXk+3waB/QCiDkddsOWWzt7Wn2YNR/CIHaxvNIdblp3mZS/buOeNsDTmQ4ct2qnNF4ArG2gKjMrAbdk4y1PuhEhinvbHile8IpYx5JoeR0gM4phIycqP733vdKL129uq0gCSE2v/nKW2NPPutYIphlFCcKnXTahAffeuNV43MDHI0B2E9m30MAEHmzr3TP/3XSvlNisVh3Iha9XEFXu3Jlc4hA9ip0biLe9jeFznRe1qc3q0iXYfGj+9K4x0n7xgYQrG0II3MEzCEQWVfnc4JFPiRjLb/yKU023aV0g0L/SGydm4y1FWXlcfnytp1KfLV5Db4sGApfZFraaAwwY0bjyB6LXjZ1Qx7KkK3KULgBJLd6fxCDPg+lHybirX/wtl0zAqHGBTlXIPchwMZ0yZ6JJj9AozdAj5/ucOCD/mFfL+daLSsYnfHWaGcseh4R1ULw/7PtIeRCgB0KPKCKUCLWNmOoOh8AoNY3s2UmGQgDJ/l7yn9oUjbnG6Ay1DSdKd1ufIKI4O8Ty1r/w6hsEbBtu2ynjJoB4jolncaCM8B0Eg65dxEINoLwioJXAbp4x7DUci9W9bwiaDd+DaBfmZUWIdXqjvjjWRNIZjWAYHCuX4ZtSTKbjbLznYsWm2Bwrp9Hbx1FqfQoANASa4dsO27HQHfpwxRHazBQXTOCtldl8xDKvkw6Yst32HCKJYJuJZlrpNgQs6+j39/335GEgngukF5tdPgF0eRdOvoGAD/JVCTja33q+U0TIGSceoUIr6XeG1b0/EF/bewc1v26KBvv/gnJ9wJ1Tadlup7RAHrh+1DYPDCECGeXH9vzM9Py/0t+HLW79FdM5iHnLHjHYmR0Dc9oAKvbF7xLbDU7W2ChuYFQ0xHxGTgSCdQ0fsPJYZMC7En7fE2rnm3J+KnLuhS8+c0/b674zJkbATSbCiWSz5940lmL3974SsEPWvprorKmMQTWhwhkvHzP0L9N5siamrOxtze8svaEk88YDaJqM7FkieLisRVnPLxl0ytDklP4k0ZVTXgcsT5DYPNcA4o7E/G2u3IVM5rbj6DtNwJYbCqbGWPYot+7jgn4X2DbdpkCjwFs7M8g0KdOPb7EyF/D6HWyYcMGOeGU0/8AoctAZBaWTaiwhvWO3bLh1ahR+QFEIhGr7JgJs8aecsY3xpx81o4tG/5suhlyWBGsbZg59qSzrjvh5Aly/rTJG9atW+fYTfzTp0y5HwTjtX2Bvt6XTn9uyaIWM3c9J8pUhRor06TPMbjcvJZ+PRFrM/IfqAw1TSfolURy6UCLF2CJBb29I9b2jBN9h4pATdPniPUWDPBVEMEWMB4lyMPJWHSFSTtBO/xNAP9mLFiwWwnTk/HWF02rOHYICYTCVxLht+Y6SS8T6hJLo4O6LlfZzeeoypVKuJyAz2RtS/ECs9yRWBptg8ugiwJAgVBjEyndDEZVtoICfZ1AD0taH8qU4LqqtslOp/UZ02Nx+tFLE7G2+Y6UdlJ4P5V24zzOkcB5ICLYIv6+qjWLn3gLACbb4VMsyBUqdKXpMvMB7UFeZFh3nHqc/9FiHlE3GJFIxFq/tfcKUr2JCPmkxVkLxUNIpx9OPPf4RqB/0KesCYCONW1EFD/ujLc6jpPMywAikYj12pbUImJcaFpHICtJ6DdgvZLA0/OVfVCj65Xxk+53S35T7CPox9fXlx61u/T/COs/5ZnA4WBUFMsJeIggXwWxeUylYFFi2ZSL88malncnVFfP+VSqtLcj12u7GKhIF4jm0W65r9Dn9ew7Q+iqfWcInVBIWUYI1vcxpuZKBJEJV7/CyvMbJsHi54fs4MZD0HcVuDMZaytIiFjQbrxJhG5ghqvUN54hsot9qHZzUpnr13BlTfgyZmTMQTMUEOuZHUvaXKVmOZgqu/kchRiProuAisqcznj0sdxFM+M6hq5zWevvjKJ1iogKXel5myqet+kGBW532/mABwYAAMlY5XcNo3WKhef+iEq43Os280UUTyRjU/7Zi7Y8iqK9TVIiV4jIa9601x9U4vgs3485vdJuzDoXd0L/AlV+g12X93EICnmVS0q+6FWeZM/CqF9sf+JDi31NEHGZw1efB/CtEj9OJKaJUH1QII5dtUi9+wwQNI+2JCUq94NxpvTSOAWuE8hKN3oIsFPVako8M9/IOdQE93Pxg6iqDV+iigVO6ojoS8T6kE/wyGCx7sGZs09Sy7pRFX/PDMOoJLydiE0Z5/aX0n8SR/fbppsxAuxh4D4LPG9lbOEhexiBuqbTSOQKgK4AMNGBKgqS5sTSqKvEUwfjuQEAQNBu/BFAWTNoKfAGQR8mWA93xBa+ZNLueRc0HN+bpusJZBQOraoXuA3X3reubzK+USh+nBb/XavbFxgkzuifRpNFV5LgcoNQ+9sSsdbvm7TrhIIYAPA9rrSTUQYfsIuVz4bIYFTaDS+YBH6Iyv2d8Wiu42azErTDDwL4cm5ZeK4z3mrmrXsoVFUTni6EKw7eCAMABdqSsdYmFGD/w/NUKv3cJuwvuxLAXyCyTYEHCDpr/JiSis5Y6z+66XwAIPDDJuWY+BI3Pgm2bZeJoTcUqRrplAHtWNa6PBlv/eapx5WdoEKfh+qDENkugj+X9eqXUKDNrwK9AfqZNL35uD1H7d3udXBFoKZ5LHFfl0mwCqmGO+JtbfnIMR3PiKBP1X+C6avflPH19aUjdo0Y5XW7AymoARSSoB1+FoBBsmj5XSIWzWsOn+NIuI9ReTIRj2Y83fRwpkCfgCIgeMisGDdMmjXL8Skb06bVjxIx9cQhI10OR47YN0B/hhB5xyhCBlib7VyfQSEZZZKeRQTd5Wk9biiOr/WCI9YAACAQCrcQITyUOqhiQTLeOuRp6/PlyP0EAFCFm5G3NzpAhlwHNxzRBsB70lH3S88uENk+inYMXc4ADziiDSCReHwPmD1dGnUE0cJYLFa03ESF4Ig2AABQcrUA4062mi1IHc4c8QZAO8c8JSJFj/MXwTunjfG7PhJmqDniDSCRuLeX2NnuoxcQYf5Qu6R7wRFvAACgUvyFGD2CF38GckSvAwyAAjUNG4nZ29PLMyHyZmJZdMjd4b3gfwDIvY4oIUBatgAAAABJRU5ErkJggg==';

var aumentarUrl = 'data:image/png;base64,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';

var reducirUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAFZ0lEQVRoQ9Waz28bRRTHvzPrpFRNUlcJFS0UOyDVERKKKzghIbmnIiE1Rsoth5gTSIkg/APgIu4ElB444RzoqagGLnCKD4gTqA4gFEdCtlFoqyZR3IQoTeKdQW9m17txNvE6/hF7Fce/1rvv896bN2/eG4YuP1iXy4/mAXyZG4WBOCSLgckwwMLeypEFSFYAkxmYSOODyGIjSmwMYO6vEBCYAZNxJTCzLqeemPobHexV8i2u7wHSFlXq11L9I6A0UJ7F9CvFemFOBqAEN5JgLKGEZkCovwfx4XOIXTqL6FAvwv09nrIUtvaRXdtD5uEO0vltFLf2HRgpU4CZrAekfoDbuU8ARsIrwScjA5h59TyiQ2fqVZ46P7u2i9k/nmA+t6Utoq2SxFTklp8L+gcgH+dIgbMoCU+CJ1+/cKSm/dzcfQ5ZJvnrhgMiRBYw47Ws4Q9ACc8y4CwYGuhB6vpFxC6frVdGX+dnHuwgsfAYxc19QMgShIwdN9BrA8zlJsFYirQ+9lIfUrFnETxj+BLmpCeVdk0kMqv4Lv8fQZBbJTAdmfe63vEAKjSyLLh2GdJ8Ow+yhBobQgCmjHpZ4mgAHSJJ+ODkSPuFtxWVyDzG/NImAZSAcrR6TBwDkLsPzqPkNukbz7VT8YfuFf/pkXYnU2QxHbnmPsEbgEIlY8nQQC+y4y+03OdraYfGRPTbFRSf0JwhDoTYwwDkOixQIL9fuPl8y6JNLaGrv6fodP37B3o8yHLYdiUPgNzX4Dxxmn5/FJwzHkQK05F3rYTFdbpL+/mJUNMmqXq1fdT5NNkN3/lHW0FoKxy0wNzy5+BsphO1X4lKFFopKgk5i+mrH1UDbMBgwfvjV06c2zRL20ddh3Kna3dXAGEWMBUZdgCsSSt0vheFiVCr5Wjo+uE7RR2RyiLqAKjQyZMfjgYx+8ZQQzdo9Y9nflnDF4slFVIdgLnlBXAWu/fWJZXXd/KRLmzjnR8f0uyccVsgD87DnRh9qpWpotE3FI3MggtgWYJzyPdf9qX8W0s7+Hm9DM4YDA4YDDT3weBMPesHq6wyaQkppFTJpaleU2bgvDcF8OaggY9H/KXp7Ku/VTg9CGBwyPf8ARjpDQQ4Q4CE50CA2a+dzwymYegQ9KCkUkiUJY0/CRK6bH8mgD4DWHs76EuBGkAeBBi9+Ayy41d8XSCQ3lDaJgD90JZQUJYlbDhiIK27hXUDlKWsfLc/dsHX/aN3V7C4+rRFAJZFNJCe8E1pa1wLWwGwrGHDNQRAKjyJC2lNH9Y8fUZjQ7mQ8nmyhKNtLbSGUVD0nU8LeLpQPYP406UdfLb81MP3tdB6YOtBTAwEQIOYXEmBWELbQH0Gw9RwbyODOJcHN8L5iRc7LonzDKOU1JnuMEoTmcFi9250y0T2iMx4YCLrrlTi9xLFZVcq0fXJHDnabRoHPNyd6TQBdMOCximzeC1o7AU9RydGo9pLSmWFbl7UKwDHCgs3L3dWWeUHq6xiLegPVyXsGcNanVElunMKW/+i+IS6PLUKWzbEXDeXFgnC7gkYLHgalelKGUVFHVWhLkHWU9y1IVR5nWNypB+pWJvL67bw1HYqizrL644r6QYHZxgbbneDY1v3zIQ4YYPDhnC5k2oxxVrcYsqsori5p1tMZqMtpoolVGs1TT0D1eQb6UfytSY3+X6zmnxq8dDMJp87IbfbrLRaJ5Cr/Y23Wf+sarPKVrRZ3RB2o5uzhO7IM4QGAoiHz6mJLzpYo9G9vgeq91OBqrhZpr6w5evtaHQfArG2GjCu90a4thnQ29FB3QBfXN91fqm2HNjbDcQpbDXwKnxUb/ZgtNmjun+iNN3UzR7/A7vvFP6e+2X2AAAAAElFTkSuQmCC';

var reflejarUrl = 'data:image/png;base64,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';

var rotarUrl = 'data:image/png;base64,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';

var mouseUrl = 'data:image/png;base64,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';