(function($) {
  $('head').append('<link rel="stylesheet" href="'+DEBUG_TOOLBAR_STATIC_PATH+'css/toolbar.css?'+ Math.random() +'" type="text/css" />');
  var fldt = {
    init: function() {
      $('#flDebug').show();
      var current = null;
      $('#flDebugPanelList li a').on('click', function() {
        if (!this.className) {
          return false;
        }
        current = $('#flDebug #' + this.className + '-content');
        if (current.is(':visible')) {
          $(document).trigger('close.flDebug');
          $(this).parent().removeClass('flDebugActive');
        } else {
          $('.flDebugPanelContentParent').hide(); // Hide any that are already open
          current.show();
          $('#flDebugToolbar li').removeClass('flDebugActive');
          $(this).parent().addClass('flDebugActive');
        }
        return false;
      });
      $('#flDebugPanelList li .flDebugSwitch').on('click', function() {
        var $this = $(this);

        if ($this.hasClass('flDebugActive')) {
          $this.removeClass('flDebugActive');
          $this.addClass('flDebugInactive');
        } else {
          $this.removeClass('flDebugInactive');
          $this.addClass('flDebugActive');
        }
      });
      $('#flDebug a.flDebugClose').on('click', function() {
        $(document).trigger('close.flDebug');
        $('#flDebugToolbar li').removeClass('flDebugActive');
        return false;
      });
      $('#flDebug a.flDebugRemoteCall').on('click', function() {
        $('#flDebugWindow').load(this.href, {}, function() {
          $('#flDebugWindow a.flDebugBack').click(function() {
            $(this).parent().parent().hide();
            return false;
          });
        });
        $('#flDebugWindow').show();
        return false;
      });
      $('#flDebugTemplatePanel a.flDebugTemplateShowContext').on('click', function() {
        fldt.toggle_arrow($(this).children('.flDebugToggleArrow'))
        fldt.toggle_content($(this).parent().next());
        return false;
      });
      $('#flDebugSQLPanel a.flDebugShowStacktrace').on('click', function() {
        fldt.toggle_content($('.flDebugHideStacktraceDiv', $(this).parents('tr')));
        return false;
      });
      $('#flDebugHideToolBarButton').on('click', function() {
        fldt.hide_toolbar();
        return false;
      });
      $('#flDebugShowToolBarButton').on('click', function() {
        fldt.show_toolbar();
        return false;
      });
      $(document).on('close.flDebug', function() {
        // If a sub-panel is open, close that
        if ($('#flDebugWindow').is(':visible')) {
          $('#flDebugWindow').hide();
          return;
        }
        // If a panel is open, close that
        if ($('.flDebugPanelContentParent').is(':visible')) {
          $('.flDebugPanelContentParent').hide();
          return;
        }
        // Otherwise, just minimize the toolbar
        if ($('#flDebugToolbar').is(':visible')) {
          fldt.hide_toolbar();
          return;
        }
      });
      fldt.show_toolbar(false);
      $('#flDebug table.flDebugTablesorter').each(function() {
          var headers = {};
          $(this).find('thead th').each(function(idx, elem) {
            headers[idx] = $(elem).data();
          });
          $(this).tablesorter({headers: headers});
        })
        .bind('sortEnd', function() {
          $(this).find('tbody tr').each(function(idx, elem) {
            var even = idx % 2 === 0;
            $(elem)
              .toggleClass('flDebugEven', even)
              .toggleClass('flDebugOdd', !even);
          });
        });
    },
    toggle_content: function(elem) {
      if (elem.is(':visible')) {
        elem.hide();
      } else {
        elem.show();
      }
    },
    close: function() {
      $(document).trigger('close.flDebug');
      return false;
    },
    hide_toolbar: function() {
      // close any sub panels
      $('#flDebugWindow').hide();
      // close all panels
      $('.flDebugPanelContentParent').hide();
      $('#flDebugToolbar li').removeClass('flDebugActive');
      // finally close toolbar
      $('#flDebugToolbar').hide('fast');
      $('#flDebugToolbarHandle').show();
      // Unbind keydown
      $(document).unbind('keydown.flDebug');
    },
    show_toolbar: function(animate) {
      // Set up keybindings
      $(document).on('keydown.flDebug', function(e) {
        if (e.keyCode == 27) {
          fldt.close();
        }
      });
      $('#flDebugToolbarHandle').hide();
      if (animate) {
        $('#flDebugToolbar').show('fast');
      } else {
        $('#flDebugToolbar').show();
      }
    },
    toggle_arrow: function(elem) {
      var uarr = String.fromCharCode(0x25b6);
      var darr = String.fromCharCode(0x25bc);
      elem.html(elem.html() == uarr ? darr : uarr);
    },
    load_href: function(href) {
      $.get(href, function(data, status, xhr) {
        document.open();
        document.write(xhr.responseText);
        document.close();
      });
      return false;
    },
    $: $
  };
  $(document).ready(function() {
    fldt.init();
  });
  window.fldt = fldt;

})(jQuery.noConflict(true));
