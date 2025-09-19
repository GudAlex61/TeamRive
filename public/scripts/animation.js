// public/scripts/animation.js
// Improved animation system (pure JavaScript — no TypeScript assertions)
// Features: IntersectionObserver AOS, once, stagger, data-aos-delay -> --aos-delay,
// parallax, smooth scroll, lazy loading, ripple, magnetic, counters, refresh API.

(function () {
  'use strict'

  const config = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px',
    animationDuration: 600, // ms
    staggerDelay: 100, // ms
    once: true,
    disable: (typeof window !== 'undefined') && window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }

  let currentObserver = null
  let microAttached = false
  let parallaxTicking = false

  if (typeof window === 'undefined' || typeof document === 'undefined') return

  function loadPolyfill () {
    const script = document.createElement('script')
    script.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver'
    script.onload = init
    document.head.appendChild(script)
  }

  if (!('IntersectionObserver' in window)) {
    console.warn('IntersectionObserver не поддерживается. Загружаем полифилл...')
    loadPolyfill()
  } else {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init)
    } else {
      init()
    }
  }

  function ensureUnit (val) {
    if (val == null) return null
    const s = String(val).trim()
    if (s === '') return null
    if (/^\d+$/.test(s)) return s + 'ms'
    return s
  }

  function observeNodes (observer, nodes) {
    nodes.forEach(function (node) {
      try {
        if (node.hasAttribute && node.hasAttribute('data-aos-onload')) return
        node.style.willChange = 'transform, opacity'
        observer.observe(node)
      } catch (e) {}
    })
  }

  function createObserver () {
    return new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        var el = entry.target
        if (!el) return

        if (entry.isIntersecting) {
          if (el.classList && el.classList.contains('stagger-animation')) {
            var children = Array.prototype.slice.call(el.querySelectorAll('[data-aos]'))
            children.forEach(function (child, i) {
              var delayAttr = child.getAttribute('data-aos-delay') || child.dataset && child.dataset.aosDelay
              if (delayAttr) child.style.setProperty('--aos-delay', ensureUnit(delayAttr))
              child.style.setProperty('--stagger-index', String(i))
              var totalDelay = i * config.staggerDelay
              setTimeout(function () { child.classList.add('aos-animate') }, totalDelay)
            })
            if (config.once) observer.unobserve(el)
            return
          }

          window.requestAnimationFrame(function () {
            el.classList.add('aos-animate')
            setTimeout(function () {
              try { el.style.willChange = 'auto' } catch (e) {}
            }, config.animationDuration + 50)
          })

          if (config.once) observer.unobserve(el)
        } else {
          if (!config.once) {
            el.classList.remove('aos-animate')
          }
        }
      })
    }, {
      threshold: config.threshold,
      rootMargin: config.rootMargin
    })
  }

  function initParallax () {
    var parallaxElements = document.querySelectorAll('.parallax')
    if (!parallaxElements.length) return

    function updateParallax () {
      var viewportHeight = window.innerHeight
      parallaxElements.forEach(function (element) {
        var rect = element.getBoundingClientRect()
        if (rect.bottom < 0 || rect.top > viewportHeight) return
        var speed = parseFloat(element.dataset.parallaxSpeed) || 0.5
        var elementCenter = rect.top + rect.height / 2
        var distanceFromCenter = (elementCenter - viewportHeight / 2)
        var yPos = -distanceFromCenter * (speed * 0.12)
        element.style.transform = 'translate3d(0, ' + yPos + 'px, 0)'
      })
      parallaxTicking = false
    }

    function requestTick () {
      if (!parallaxTicking) {
        window.requestAnimationFrame(updateParallax)
        parallaxTicking = true
      }
    }

    window.addEventListener('scroll', requestTick, { passive: true })
    window.addEventListener('resize', requestTick, { passive: true })
    requestTick()
  }

  function initSmoothScroll () {
    var anchors = document.querySelectorAll('a[href^="#"]')
    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href')
        if (!targetId || targetId === '#') return
        var targetElement = document.querySelector(targetId)
        if (!targetElement) return
        e.preventDefault()
        var headerHeight = document.querySelector('header') && document.querySelector('header').offsetHeight || 0
        var targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - headerHeight - 20
        smoothScrollTo(targetPosition, 800)
        try { history.pushState(null, null, targetId) } catch (err) {}
      })
    })
  }

  function smoothScrollTo (targetPosition, duration) {
    var startPosition = window.pageYOffset
    var distance = targetPosition - startPosition
    var startTime = performance.now()

    function animation (currentTime) {
      var elapsed = currentTime - startTime
      var progress = Math.min(elapsed / duration, 1)
      var easeInOutCubic = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2

      window.scrollTo(0, startPosition + distance * easeInOutCubic)

      if (progress < 1) requestAnimationFrame(animation)
    }

    requestAnimationFrame(animation)
  }

  function initLazyLoading () {
    var lazyImages = Array.prototype.slice.call(document.querySelectorAll('img[loading="lazy"]'))

    if ('loading' in HTMLImageElement.prototype) {
      lazyImages.forEach(function (img) {
        img.addEventListener('load', function () { this.classList.add('loaded') })
      })
    } else {
      var imageObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var img = entry.target
            try { if (img.dataset && img.dataset.src) img.src = img.dataset.src } catch (e) {}
            img.classList.add('loaded')
            imageObserver.unobserve(img)
          }
        })
      }, { rootMargin: '50px 0px' })

      lazyImages.forEach(function (img) { imageObserver.observe(img) })
    }

    checkWebPSupport()
  }

  function checkWebPSupport () {
    var webP = new Image()
    webP.onload = webP.onerror = function () {
      var isSupported = webP.height === 2
      if (isSupported) document.documentElement.classList.add('webp')
      else document.documentElement.classList.add('no-webp')
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  }

  function initMicroAnimations () {
    if (!microAttached) {
      var buttons = Array.prototype.slice.call(document.querySelectorAll('.ripple, button, .btn'))
      buttons.forEach(function (button) {
        if (button.__rippleBound) return
        button.addEventListener('click', createRipple)
        button.__rippleBound = true
      })

      var magnetics = Array.prototype.slice.call(document.querySelectorAll('.magnetic'))
      magnetics.forEach(function (element) {
        if (element.__magneticBound) return
        element.addEventListener('mousemove', handleMagneticHover)
        element.addEventListener('mouseleave', resetMagneticHover)
        element.__magneticBound = true
      })

      microAttached = true
    }

    animateCounters()
  }

  function createRipple (e) {
    var button = e.currentTarget
    var ripple = document.createElement('span')
    var rect = button.getBoundingClientRect()
    var size = Math.max(rect.width, rect.height)
    var x = e.clientX - rect.left - size / 2
    var y = e.clientY - rect.top - size / 2

    ripple.style.width = size + 'px'
    ripple.style.height = size + 'px'
    ripple.style.left = x + 'px'
    ripple.style.top = y + 'px'
    ripple.className = 'ripple-effect'

    button.appendChild(ripple)

    setTimeout(function () {
      try { ripple.remove() } catch (e) {}
    }, 600)
  }

  function handleMagneticHover (e) {
    var element = e.currentTarget
    var rect = element.getBoundingClientRect()
    var x = e.clientX - rect.left - rect.width / 2
    var y = e.clientY - rect.top - rect.height / 2
    element.style.transform = 'translate(' + (x * 0.2) + 'px, ' + (y * 0.2) + 'px)'
  }

  function resetMagneticHover (e) {
    e.currentTarget.style.transform = 'translate(0, 0)'
  }

  function animateCounters () {
    var counters = Array.prototype.slice.call(document.querySelectorAll('[data-counter]'))
    if (!counters.length) return

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var counter = entry.target
          var target = parseInt(counter.dataset.counter, 10) || 0
          var duration = parseInt(counter.dataset.duration, 10) || 2000
          var increment = target / Math.max(1, Math.round(duration / 16))
          var current = 0

          var updateCounter = function () {
            current += increment
            if (current < target) {
              counter.textContent = Math.floor(current)
              requestAnimationFrame(updateCounter)
            } else {
              counter.textContent = String(target)
            }
          }

          updateCounter()
          counterObserver.unobserve(counter)
        }
      })
    }, { threshold: 0.5 })

    counters.forEach(function (counter) { counterObserver.observe(counter) })
  }

  function revealAll () {
    var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-aos]'))
    nodes.forEach(function (element) {
      element.classList.add('aos-animate')
      try {
        element.style.opacity = '1'
        element.style.transform = 'none'
        element.style.willChange = 'auto'
      } catch (e) {}
    })
  }

  function init () {
    try {
      document.documentElement.style.setProperty('--aos-stagger', config.staggerDelay + 'ms')
      document.documentElement.style.setProperty('--aos-duration', config.animationDuration + 'ms')
    } catch (e) {}

    if (config.disable) {
      revealAll()
      window.AnimationSystem = window.AnimationSystem || {}
      window.AnimationSystem.ready = true
      return
    }

    var allAos = Array.prototype.slice.call(document.querySelectorAll('[data-aos]'))
    allAos.forEach(function (el) {
      var delay = el.dataset && el.dataset.aosDelay || (el.getAttribute && el.getAttribute('data-aos-delay'))
      if (delay != null) {
        var withUnit = ensureUnit(delay)
        if (withUnit) el.style.setProperty('--aos-delay', withUnit)
      }
    })

    var onloadEls = Array.prototype.slice.call(document.querySelectorAll('[data-aos-onload]'))
    onloadEls.forEach(function (el) {
      var delayAttr = el.dataset && el.dataset.aosDelay || (el.getAttribute && el.getAttribute('data-aos-delay'))
      var delay = delayAttr ? (parseInt(String(delayAttr), 10) || 0) : 0
      if (delay > 0) {
        setTimeout(function () { el.classList.add('aos-animate') }, delay)
      } else {
        window.requestAnimationFrame(function () { el.classList.add('aos-animate') })
      }
    })

    if (currentObserver) {
      try { currentObserver.disconnect() } catch (e) {}
      currentObserver = null
    }
    currentObserver = createObserver()

    var animatedElements = Array.prototype.slice.call(document.querySelectorAll('[data-aos]'))
    observeNodes(currentObserver, animatedElements)

    var staggerGroups = Array.prototype.slice.call(document.querySelectorAll('.stagger-animation'))
    staggerGroups.forEach(function (group) {
      try {
        if (!group.hasAttribute || !group.hasAttribute('data-aos-onload')) {
          currentObserver.observe(group)
        }
        var children = Array.prototype.slice.call(group.querySelectorAll('[data-aos]'))
        children.forEach(function (child, i) {
          child.style.setProperty('--stagger-index', String(i))
          var delay = child.dataset && child.dataset.aosDelay || (child.getAttribute && child.getAttribute('data-aos-delay'))
          if (delay != null) {
            var withUnit = ensureUnit(delay)
            if (withUnit) child.style.setProperty('--aos-delay', withUnit)
          }
        })
      } catch (e) {}
    })

    initParallax()
    initSmoothScroll()
    initLazyLoading()
    initMicroAnimations()

    window.AnimationSystem = window.AnimationSystem || {}
    window.AnimationSystem.ready = true
  }

  function refresh () {
    try {
      if (currentObserver) {
        try { currentObserver.disconnect() } catch (e) {}
        currentObserver = null
      }

      currentObserver = createObserver()
      var nodes = Array.prototype.slice.call(document.querySelectorAll('[data-aos], .stagger-animation'))
      nodes.forEach(function (node) {
        try {
          if (node.hasAttribute && node.hasAttribute('data-aos')) {
            var delay = node.dataset && node.dataset.aosDelay || (node.getAttribute && node.getAttribute('data-aos-delay'))
            if (delay != null) {
              var withUnit = ensureUnit(delay)
              if (withUnit) node.style.setProperty('--aos-delay', withUnit)
            }
            node.style.willChange = 'transform, opacity'
          }
          if (node.classList && node.classList.contains('stagger-animation')) {
            var children = Array.prototype.slice.call(node.querySelectorAll('[data-aos]'))
            children.forEach(function (child, i) {
              child.style.setProperty('--stagger-index', String(i))
              var cdelay = child.dataset && child.dataset.aosDelay || (child.getAttribute && child.getAttribute('data-aos-delay'))
              if (cdelay != null) {
                var w = ensureUnit(cdelay)
                if (w) child.style.setProperty('--aos-delay', w)
              }
            })
          }
        } catch (e) {}
      })

      observeNodes(currentObserver, nodes)
    } catch (e) {
      try { init() } catch (err) {}
    }
  }

  window.AnimationSystem = window.AnimationSystem || {}
  window.AnimationSystem.init = function () { try { init() } catch (e) {} }
  window.AnimationSystem.refresh = function () { try { refresh() } catch (e) {} }
  window.AnimationSystem.disable = function () { config.disable = true; revealAll() }
  window.AnimationSystem.enable = function () { config.disable = false; try { init() } catch (e) {} }
  window.AnimationSystem.ready = false

})()
