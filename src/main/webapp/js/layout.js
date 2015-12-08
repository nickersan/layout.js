(
  function(global, factory)
  {
    factory(global);
  }(
    window,
    function(window)
    {
      var build = function(layout)
      {
        return function()
        {
          return function()
          {
            var element = layout.element();
            element.css("position", "absolute");

            layout.constraints.forEach(function(constraint) { constraint.apply(element); });
          }
        }
      };

      var constraint = function(layout, constraintType, valueSetter)
      {
        return function(value)
        {
          if (!value)
          {
            value = 0;
          }

          var apply = function(element)
          {
            if (this.relativeTo)
            {
              var relativeElement = $(this.relativeTo.element());

              if (relativeElement.length == 1)
              {
                value = this.relativeTo.relativeType.getRelativeValue(element, relativeElement, constraintType, value);
              }
              else
              {
                throw "A single relative element could not be found";
              }
            }

            valueSetter(element, value);
          };

          var constraint = { apply: apply };
          layout.constraints.push(constraint);
          layout.lastConstraint = constraint;

          return this;
        };
      };

      var relativeTo = function(layout)
      {
        return function(selector, relativeType)
        {
          if (layout.lastConstraint)
          {
            layout.lastConstraint.relativeTo = { element: function() { return $(selector) }, relativeType: relativeType};
            return this;
          }
          else
          {
            throw "A constraint must be set before a relative value can be added";
          }
        }
      };

      var css = function(name)
      {
        return function(element, value)
        {
          element.css(name, value + "px");
        }
      };

      window.$layout = function(selector)
      {
        if (typeof $ === "undefined")
        {
          throw new Error("layout-js requires jQuery.");
        }

        var layout = { element: function() { return $(selector) }, constraints: [] };

        return {
          bottom: constraint(layout, "bottom", css("bottom")),
          build: build(layout),
          centerX: constraint(layout, "centerX", css("left")),
          centerY: constraint(layout, "centerY", css("top")),
          height: constraint(layout, "height", css("height")),
          left: constraint(layout, "left", css("left")),
          relativeTo: relativeTo(layout),
          right: constraint(layout, "right", css("right")),
          top: constraint(layout, "top", css("top")),
          width: constraint(layout, "width", css("width"))
        };
      };

      window.$layout.BOTTOM = {
        name: "bottom",
        getRelativeValue: function(element, relativeElement, constraintType, constraintValue)
        {
          var position = relativeElement.position();
          var height = relativeElement.height();

          var relativeBottom = position.top + height;

          switch (constraintType)
          {
            case "bottom":
              return relativeBottom + constraintValue;

            case "top":
              return relativeBottom + constraintValue;

            default:
              throw constraintType + " cannot be relative to the bottom of another element"
          }
        }
      };

      window.$layout.CENTER = {
        name: "center",
        getRelativeValue: function(element, relativeElement, constraintType, constraintValue)
        {
          var position = relativeElement.position();

          if (element.parent().is(relativeElement))
          {
            switch (constraintType)
            {
              case "centerX":
                var width1 = relativeElement.width() > element.width() ? relativeElement.width() : element.width();
                var width2 = relativeElement.width() < element.width() ? relativeElement.width() : element.width();
                return (width1 / 2) - (width2 / 2);

              case "centerY":
                var height1 = relativeElement.height() > element.height() ? relativeElement.height() : element.height();
                var height2 = relativeElement.height() < element.height() ? relativeElement.height() : element.height();
                return (height1 / 2) - (height2 / 2);
            }
          }
          else
          {
            switch (constraintType)
            {
              case "centerX":
                return position.left + ((relativeElement.width() / 2) - (element.width() / 2));

              case "centerY":
                return position.top + ((relativeElement.height() / 2) - (element.height() / 2));
            }
          }

          throw constraintType + " cannot be relative to the center of another element";
        }
      };

      window.$layout.HEIGHT = {
        name: "height",
        getRelativeValue: function(element, relativeElement, constraintType, constraintValue)
        {
          throw "Implement me";
        }
      };

      window.$layout.LEFT = {
        name: "left",
        getRelativeValue: function(element, relativeElement, constraintType, constraintValue)
        {
          var position = relativeElement.position();

          switch (constraintType)
          {
            case "left":
              return position.left + constraintValue;

            case "right":
              return (relativeElement.parent().width() - position.left) + constraintValue;

            default:
              throw constraintType + " cannot be relative to the left of another element"
          }
        }
      };

      window.$layout.RIGHT = {
        name: "right",
        getRelativeValue: function(element, relativeElement, constraintType, constraintValue)
        {
          var position = relativeElement.position();
          var width = relativeElement.width();

          var relativeRight = position.left + width;

          switch (constraintType)
          {
            case "left":
              return relativeRight + constraintValue;

            case "right":
              return relativeRight + constraintValue;

            default:
              throw constraintType + " cannot be relative to the right of another element"
          }
        }
      };

      window.$layout.TOP = {
        name: "top",
        getRelativeValue: function(element, relativeElement, constraintType, constraintValue)
        {
          var position = relativeElement.position();

          switch (constraintType)
          {
            case "bottom":
              return (relativeElement.parent().height() - position.top) + constraintValue;

            case "top":
              return position.top + constraintValue;

            default:
              throw constraintType + " cannot be relative to the top of another element"
          }
        }
      };

      window.$layout.WIDTH = {
        name: "width",
        getRelativeValue: function(element, relativeElement, constraintType, constraintValue)
        {
          throw "Implement me";
        }
      };
    }
  )
);
