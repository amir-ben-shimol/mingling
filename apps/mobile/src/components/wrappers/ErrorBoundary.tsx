import React, { Component, type ErrorInfo, type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { UIText } from '@/ui/UIText';

type Props = {
	children: ReactNode;
};

type State = {
	hasError: boolean;
	error: Error | null;
	errorInfo: ErrorInfo | null;
};

class ErrorBoundary extends Component<Props, State> {
	public override state: State = {
		hasError: false,
		error: null,
		errorInfo: null,
	};

	public static getDerivedStateFromError(error: Error): State {
		return { hasError: true, error, errorInfo: null };
	}

	public override componentDidCatch(error: Error, errorInfo: ErrorInfo) {
		this.setState({ error, errorInfo });
		// You can also log the error to an error reporting service
		console.error('ErrorBoundary caught an error', error, errorInfo);
	}

	public override render() {
		if (this.state.hasError) {
			return (
				<View style={styles.container}>
					<UIText style={styles.title}>Something went wrong.</UIText>
					{this.state.error && <UIText style={styles.error}>{this.state.error.toString()}</UIText>}
					{this.state.errorInfo && <UIText style={styles.errorInfo}>{this.state.errorInfo.componentStack}</UIText>}
				</View>
			);
		}

		return this.props.children;
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
		padding: 40,
		overflow: 'scroll',
	},
	title: {
		fontSize: 18,
		fontWeight: 'bold',
		marginBottom: 10,
	},
	error: {
		fontSize: 16,
		color: 'red',
	},
	errorInfo: {
		fontSize: 14,
		color: 'gray',
	},
});

export default ErrorBoundary;
