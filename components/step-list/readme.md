# Accordion component

This custom element provides expansion and contraction inside a list with show/hide links

<img src="https://raw.githubusercontent.com/cagov/Alpha/master/components/step-list/step-list.png" />

## Sample markup

```
<cwds-step-list>
  <ul class="list-group list-group-flush">
    <li class="list-group-item unstyled list-group-item-action">
      <button type="button" class="step-description">
        <span class="list-number">1</span>Decide what type of contractor you need
      </button><span class="show">Show</span><span class="hide">Hide</span>
      <div class="details">
        <span class="step-interior">
          <p>Ite Content Here...</p>
        </span>
      </div>
    </li>
    <li class="list-group-item lead unstyled list-group-item-action">
      <button type="button" class="step-description">
        <span class="list-number">2</span>Check if you need a building permit
      </button>
      <span class="show">Show</span><span class="hide">Hide</span>
      <div class="details">
        <span class="step-interior">
          <p>Ite Content Here...</p>
        </span>
      </div>
    </li>
  </ul>
</cwds-step-list>
```
