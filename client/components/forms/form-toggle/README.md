Toggle
=======

This component is used to implement toggle switches.

#### How to use:

```jsx
import FormToggle from 'components/forms/form-toggle';

function MyComponent() {
	return (
		<FormToggle
			checked={ this.props.checked }
			disabled={ this.props.disabled }
			onChange={ this.props.onChange } />
	);
}
```

#### Props

* `checked`: (bool) the current status of the toggle.
* `disabled`: (bool) whether the toggle should be in the disabled state.
* `onChange`: (callback) what should be executed once the user clicks the toggle.
